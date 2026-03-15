import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as kill from 'tree-kill';

@Injectable()
export class TestRunnerService {
  
  private cleanOutput(data: string): string[] {
    const noAnsi = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    return noAnsi.split(/[\r\n]+/).map(line => line.trimEnd()).filter(line => line.length > 0);
  }

  private getRepoHash(url: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(url).digest('hex');
  }

  runTests(suites: string[], target: 'backend' | 'frontend' = 'backend', repositoryUrl?: string, envVars?: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>(subscriber => {
      const fs = require('fs');
      let tempDir: string | null = null;
      let isAborted = false;
      let childProcess: ChildProcess | null = null;

      console.log(`[TestRunner] Starting tests for target: ${target}, repo: ${repositoryUrl || 'local'}`);

      const send = (data: any) => {
        if (!isAborted) {
          subscriber.next({ data });
        }
      };

      // Global Heartbeat to keep proxy/connection alive during long tests
      const heartbeat = setInterval(() => {
        send({ type: 'heartbeat' });
      }, 15000);

      const run = async () => {
        let executionDir: string = path.resolve(process.cwd());

        const onSpawn = (child: ChildProcess) => {
          childProcess = child;
        };

        try {
          console.log(`[TestRunner] Execution started. Repository: ${repositoryUrl}`);
          if (repositoryUrl && repositoryUrl.trim() !== '') {
            const crypto = require('crypto');

            send({ text: '☁️ CI/CD Cloud Runner Initialized...', type: 'cmd' });

            // 1. PERSISTENT CACHE PATH
            const repoHash = this.getRepoHash(repositoryUrl);
            tempDir = path.resolve(process.cwd(), `../tmp_tests/cache_${repoHash}`);

            if (!fs.existsSync(path.dirname(tempDir))) {
              fs.mkdirSync(path.dirname(tempDir), { recursive: true });
            }

            const isPresent = fs.existsSync(tempDir);
            
            if (isPresent) {
              send({ text: '♻️ Repository found in cache. Updating code...', type: 'info' });
              await this.executeCommand('git', ['fetch', '--all'], tempDir, send, onSpawn);
              await this.executeCommand('git', ['reset', '--hard', 'origin/main'], tempDir, send, onSpawn);
            } else {
              send({ text: `$ git clone ${repositoryUrl} (Standard clone)`, type: 'cmd' });
              await this.executeCommand('git', ['clone', repositoryUrl, `"${tempDir}"`], process.cwd(), send, onSpawn);
            }

            executionDir = tempDir;

            const possibleSubDir = target === 'frontend' ? 'frontend' : 'backend';
            const subDirPath = path.join(tempDir, possibleSubDir);

            if (fs.existsSync(subDirPath)) {
              send({ text: `📂 Monorepo detected: entering /${possibleSubDir} folder`, type: 'info' });
              executionDir = subDirPath;
            }

            if (envVars && envVars.trim() !== '') {
              send({ text: '🔐 Injecting encrypted environment variables...', type: 'warning' });

              let finalEnv = envVars;
              if (finalEnv.includes('PORT=')) {
                finalEnv = finalEnv.replace(/PORT=\d+/, 'PORT=3005');
              } else {
                finalEnv += '\nPORT=3005';
              }

              fs.writeFileSync(path.join(executionDir, '.env'), finalEnv);
              send({ text: '✅ .env created with PORT=3005 override', type: 'success' });
            }

            // 3. OPTIMIZED INSTALLATION
            const hasNodeModules = fs.existsSync(path.join(executionDir, 'node_modules'));
            const hasLockFile = fs.existsSync(path.join(executionDir, 'package-lock.json'));
            const npmAction = hasLockFile ? 'ci' : 'install';

            if (hasNodeModules && isPresent) {
               send({ text: '⚡ dependencies detected. Skipping install for speed!', type: 'success' });
            } else {
              send({ text: `📦 Installing dependencies using ${npmAction}...`, type: 'cmd' });
              const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
              const installHeartbeat = setInterval(() => {
                send({ text: '☕ Still working... (Downloading node_modules)', type: 'info' });
              }, 15000);

              try {
                await this.executeCommand(npmCmd, [npmAction, '--legacy-peer-deps', '--no-audit', '--no-fund'], executionDir, send, onSpawn);
              } finally {
                clearInterval(installHeartbeat);
              }
            }

          } else {
            if (target === 'frontend') {
              executionDir = path.resolve(process.cwd(), '../frontend');
              if (!fs.existsSync(executionDir)) {
                 throw new Error(`Frontend directory not found: ${executionDir}`);
              }
            }
          }

          // --- INJECT STABILITY PATCHES (Local Overrides) ---
          if (target === 'frontend') {
            const karmaConfigPath = path.join(executionDir, 'karma.conf.js');
            const angularJsonPath = path.join(executionDir, 'angular.json');

            send({ text: '🔧 Applying stability patches to runner environment...', type: 'warning' });

            // 1. Create karma.conf.js with port 9876
            const karmaContent = `
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: { jasmine: { } },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'kjhtml'],
    port: 3005,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: false
  });
};`;
            fs.writeFileSync(karmaConfigPath, karmaContent);

            // 2. Patch angular.json to use karma.conf.js
            if (fs.existsSync(angularJsonPath)) {
              try {
                const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
                if (angularJson.projects && angularJson.projects.frontend && angularJson.projects.frontend.architect && angularJson.projects.frontend.architect.test) {
                  angularJson.projects.frontend.architect.test.options.karmaConfig = 'karma.conf.js';
                  fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2));
                }
              } catch (e) {
                console.error('Failed to patch angular.json', e);
              }
            }
          }

          let args: string[];
          if (target === 'frontend') {
            // Port is now set to 3005 in injected karma.conf.js or angular.json
            args = ['run', 'test', '--', '--watch=false', '--browsers=ChromeHeadless'];
            send({ text: `$ ng test --watch=false --browsers=ChromeHeadless`, type: 'cmd' });
          } else {
            args = ['run', 'test', '--', '--verbose'];
            send({ text: `$ npm run test --verbose`, type: 'cmd' });
          }

          const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
          await this.executeCommand(npmCmd, args, executionDir, send, onSpawn);

          send({ text: '✅ All tasks completed successfully! 🚀', type: 'success' });

        } catch (error: any) {
          console.error(`[TestRunner] Error:`, error);
          send({ text: `❌ CI/CD Pipeline Failed: ${error.message || error}`, type: 'error' });
        } finally {
          send({ done: true });
          clearInterval(heartbeat);
          subscriber.complete();
          console.log(`[TestRunner] Test execution finished.`);
        }
      };

      run();

      return () => {
        isAborted = true;
        clearInterval(heartbeat);
        
        if (childProcess && childProcess.pid) {
          console.log(`[TestRunner] Subscription cancelled by client. Killing process tree for PID: ${childProcess.pid}`);
          kill(childProcess.pid, 'SIGTERM');
        } else {
          console.log(`[TestRunner] Subscription cancelled by client.`);
        }
      };
    });
  }

  private executeCommand(command: string, args: string[], cwd: string, send: (data: any) => void, onSpawn?: (child: ChildProcess) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd: cwd, shell: true });
      if (onSpawn) onSpawn(child);

      child.stdout.on('data', (data) => {
        const lines = this.cleanOutput(data.toString());
        lines.forEach(line => send({ text: line, type: 'info' }));
      });

      child.stderr.on('data', (data) => {
        const lines = this.cleanOutput(data.toString());
        lines.forEach(line => send({ text: line, type: 'info' }));
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command "${command} ${args.join(' ')}" exited with logic code ${code}`));
        }
      });

      child.on('error', (err) => {
        reject(err);
      });
    });
  }
}
