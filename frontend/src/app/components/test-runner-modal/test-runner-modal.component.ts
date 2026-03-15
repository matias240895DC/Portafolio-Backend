import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LogEntry {
  text: string;
  type: 'cmd' | 'info' | 'success' | 'warning' | 'error';
}

@Component({
  selector: 'app-test-runner-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-runner-modal.component.html',
  styleUrls: ['./test-runner-modal.component.css']
})
export class TestRunnerModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() projectName: string = '';
  @Input() projectId: string = '';
  @Input() testTarget: 'backend' | 'frontend' = 'backend';
  @Input() tests: string[] = []; // Currently not used directly for filtering in backend, but good for UI context
  @Output() close = new EventEmitter<void>();

  @ViewChild('terminalBody') private terminalBody!: ElementRef;

  logs: LogEntry[] = [];
  simulationFinished: boolean = false;
  executionTime: number = 0;
  private eventSource: EventSource | null = null;
  private startTime: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.startLiveTests();
  }

  ngOnDestroy() {
    this.closeConnection();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
    } catch(err) { }
  }

  startLiveTests() {
    this.startTime = Date.now();
    this.logs = [];
    this.simulationFinished = false;
    
    // Initial commands shown to user
    const cmd = this.testTarget === 'frontend' ? 'ng test --watch=false --browsers=ChromeHeadless' : 'npm run test';
    this.addLog(cmd, 'cmd');
    
    if (!this.projectId) {
      this.addLog('Error: Project ID is missing.', 'error');
      this.simulationFinished = true;
      return;
    }

    // Connect to the actual backend test runner
    // We use the same API path that other services use (/api/projects/...)
    this.eventSource = new EventSource(`/api/projects/${this.projectId}/test-stream?target=${this.testTarget}`);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'heartbeat') {
          return;
        }

        if (data.done) {
          this.simulationFinished = true;
          this.executionTime = Date.now() - this.startTime;
          this.closeConnection();
        } else if (data.text) {
          this.addLog(data.text, data.type || 'info');
        }
        this.cdr.detectChanges();
      } catch (e) {
        // SSE sometimes sends comments or pings which might not be JSON
        console.warn('Could not parse SSE message', event.data);
      }
    };

    this.eventSource.onerror = (error) => {
      this.addLog('Test execution finished or connection dropped.', 'warning');
      this.simulationFinished = true;
      this.executionTime = Date.now() - this.startTime;
      this.closeConnection();
      this.cdr.detectChanges();
    };
  }

  private addLog(text: string, type: 'cmd' | 'info' | 'success' | 'warning' | 'error') {
    // Basic color coding for Jest output if not explicitly typed
    if (type === 'info') {
      if (text.includes('PASS')) type = 'success';
      if (text.includes('FAIL')) type = 'error';
      if (text.includes('Test Suites:') || text.includes('Tests:')) type = 'warning'; // highlight summary
    }
    this.logs.push({ text, type });
  }

  private closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  onClose() {
    this.close.emit();
  }
}
