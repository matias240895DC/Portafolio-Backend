import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class TestRunnerService {
  
  private cleanOutput(data: string): string[] {
    // Strip ANSI escape codes
    // Matches \x1b[ or \033[ followed by any number of semicolon-separated digits, ending with m or K
    const noAnsi = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    
    // Split by newline AND carriage return (Jest uses \r for progress bars)
    return noAnsi.split(/[\r\n]+/).map(line => line.trimEnd()).filter(line => line.length > 0);
  }

  runTests(suites: string[], target: 'backend' | 'frontend' = 'backend', repositoryUrl?: string, envVars?: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    
    // We wrap the process in an async IIFE to use await inside the observable
    (async () => {
      let executionDir: string = path.resolve(process.cwd());
      let tempDir: string | null = null;

      try {
        if (repositoryUrl && repositoryUrl.trim() !== '') {
          // --- CI/CD CLOUD RUNNER FLOW ---
          const crypto = require('crypto');
          const fs = require('fs');
          
          subject.next({ data: { text: '☁️ CI/CD Cloud Runner Initialized...', type: 'cmd' } });
          
          // 1. Create a unique temporary directory
          const uniqueId = crypto.randomBytes(8).toString('hex');
          tempDir = path.resolve(process.cwd(), `../tmp_tests/project_${uniqueId}`);
          
          // Ensure parent temp folder exists
          if (!fs.existsSync(path.dirname(tempDir))) {
            fs.mkdirSync(path.dirname(tempDir), { recursive: true });
          }

          // 2. Clone the repository
          subject.next({ data: { text: `$ git clone ${repositoryUrl} temp_folder`, type: 'cmd' } });
          await this.executeCommand('git', ['clone', repositoryUrl, tempDir], process.cwd(), subject);
          
          executionDir = tempDir; // Now we will execute tests inside the cloned repo

          // --- SECRETS INJECTION ---
          if (envVars && envVars.trim() !== '') {
            subject.next({ data: { text: '🔐 Injecting encrypted environment variables...', type: 'warning' } });
            fs.writeFileSync(path.join(executionDir, '.env'), envVars);
            subject.next({ data: { text: '✅ .env file created successfully in project root', type: 'success' } });
          }

          // 3. Install dependencies
          subject.next({ data: { text: `$ npm install --legacy-peer-deps (Downloading dependencies...)`, type: 'cmd' } });
          subject.next({ data: { text: '⏳ This may take a minute depending on the repository size...', type: 'warning' } });
          await this.executeCommand('npm', ['install', '--legacy-peer-deps'], executionDir, subject);

        } else {
          // --- LOCAL RUNNER FLOW (Current behavior) ---
          if (target === 'frontend') {
            executionDir = path.resolve(process.cwd(), '../frontend');
          }
        }

        // --- EXECUTE TESTS ---
        let args: string[];
        if (target === 'frontend') {
          args = ['run', 'test', '--', '--watch=false', '--browsers=ChromeHeadless'];
          subject.next({ data: { text: `$ ng test --watch=false --browsers=ChromeHeadless`, type: 'cmd' } });
        } else {
          args = ['run', 'test', '--', '--verbose'];
          subject.next({ data: { text: `$ npm run test --verbose`, type: 'cmd' } });
        }

        await this.executeCommand('npm', args, executionDir, subject);
        
        subject.next({ data: { text: '✅ All tasks completed successfully! 🚀', type: 'success' } });

      } catch (error: any) {
        subject.next({ data: { text: `❌ CI/CD Pipeline Failed: ${error.message || error}`, type: 'error' } });
      } finally {
        // --- CLEANUP ---
        if (tempDir) {
           subject.next({ data: { text: `$ rm -rf temp_folder (Cleaning up server storage)`, type: 'cmd' } });
           try {
             const fs = require('fs');
             fs.rmSync(tempDir, { recursive: true, force: true });
           } catch (e) {
             console.error('Failed to cleanup temp dir', e);
           }
        }
        subject.next({ data: { done: true } });
        subject.complete();
      }
    })();
    
    return subject.asObservable();
  }

  /**
   * Helper function to wrap child_process.spawn in a Promise and pipe its output to the SSE Subject.
   */
  private executeCommand(command: string, args: string[], cwd: string, subject: Subject<MessageEvent>): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd: cwd, shell: true });

      child.stdout.on('data', (data) => {
        const lines = this.cleanOutput(data.toString());
        lines.forEach(line => subject.next({ data: { text: line, type: 'info' } }));
      });

      child.stderr.on('data', (data) => {
        const lines = this.cleanOutput(data.toString());
        lines.forEach(line => subject.next({ data: { text: line, type: 'info' } }));
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
