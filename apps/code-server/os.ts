import { exec, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import { CommandItem, ProcessedCommand, CommandResult, GetCommandStatus, CommandStatus } from '@repo/types';
const BASE_DIR = path.join(__dirname, 'tmp');
console.log('BASE_DIR', BASE_DIR);



class CommandQueue {
  private queue: CommandItem[] = [];
  private processedCommands: ProcessedCommand[] = [];
  private currentProcess: ChildProcess | null = null;
  private currentCommand: CommandItem | null = null;
  private static DEFAULT_TIMEOUT = 30000; // 30 seconds
  public enqueue(command: string, priority: number = 0, timeout?: number): string {
    const id = Math.random().toString(36).substring(7);
    this.queue.push({ id, command, priority, timeout, startTime: Date.now() });
    this.sortQueue();
    this.processNext();
    return id;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private async processNext(): Promise<void> {
    if (this.currentProcess || this.queue.length === 0) return;

    const command = this.queue.shift();
    if (!command) return;

    this.currentCommand = command;
    command.startTime = Date.now();

    try {
      await this.executeCommand(command);
      // Stream this to frontend so that it should display that this command with commandID is completed and next command should start
    } catch (error) {
      console.error(`Command ${command.id} failed:`, error);
    } finally {
      this.currentCommand = null;
      this.currentProcess = null;
      this.processNext();
    }
  }

  private executeCommand(command: CommandItem): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      let output = '';
      let errorOutput = '';

      const timeout = command.timeout || CommandQueue.DEFAULT_TIMEOUT;
      const timer = setTimeout(() => {
        if (this.currentProcess) {
          this.currentProcess.kill();
          reject(new Error(`Command timed out after ${timeout}ms`)); 
        }
      }, timeout);

      this.currentProcess = exec(`cd ${BASE_DIR} && ${command.command}`);

      this.currentProcess.stdout?.on('data', (data) => {
        output += data;
        console.log(`[${command.id}] stdout: ${data}`); // Not required to stream this as mostly the AI executed command logs will be useless
      });

      this.currentProcess.stderr?.on('data', (data) => {
        errorOutput += data;
        console.error(`[${command.id}] stderr: ${data}`); // Stream this to frontend
      });

      this.currentProcess.on('exit', (code, signal) => {
        clearTimeout(timer);
        const result: CommandResult = {
          id: command.id,
          success: code === 0,
          output,
          error: errorOutput,
          exitCode: code ?? undefined
        };
        this.processedCommands.push({
          ...result,
          command: command.command,
          priority: command.priority
        });
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      this.currentProcess.on('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  public clear(): void {
    if (this.currentProcess) {
      this.currentProcess.kill();
    }
    this.queue = [];
    this.currentCommand = null;
    this.currentProcess = null;
  }

  public getStatus(): { current: CommandItem | null; pending: CommandItem[] } {
    return {
      current: this.currentCommand,
      pending: [...this.queue]
    };
  }

  public getCommandStatus(id: string): GetCommandStatus | null {
    if(this.currentCommand?.id === id){
      return {
        ...this.currentCommand,
        success: false,
        output: '',
        error: '',
        exitCode: undefined,
        status: CommandStatus.RUNNING
      } 
    }
    const command = this.queue.find((command) => command.id === id);
    if(command){
      return {
        ...command,
        success: false,
        output: '',
        error: '',
        exitCode: undefined,
        status: CommandStatus.PENDING
      }
    }
    const processedCommand = this.processedCommands.find((command) => command.id === id);
    if(processedCommand){
      return {
        ...processedCommand,
        status: CommandStatus.COMPLETED
      }
    }
    return {
      id: id,
      command: '',
      priority: 0,
      timeout: 0,
      startTime: 0,
      success: false,
      output: '',
      error: '',
      exitCode: undefined,
      status: CommandStatus.NOT_FOUND
    }
  }
}

const commandQueue = new CommandQueue();

export const onShellCommand = (command: string, priority: number = 0, timeout?: number): string => {
  const commandId = commandQueue.enqueue(command, priority, timeout);
  return commandId; // TODO: Send {commandId, command} to client so that it can push it in it's commands array and hence track the commands
};
// function getDummyStatus(){
//     const interval = setInterval(() => {
//       console.log('Dummy status:', commandQueue.getCommandStatus(commandId));
//       if(commandQueue.getCommandStatus(commandId)?.status === CommandStatus.COMPLETED){
//         clearInterval(interval);
//       }
//     }, 1000);
//   }
//   getDummyStatus();
onShellCommand('node test.js');
onShellCommand('node test.js');

export const onFileCommand = (command:{
    filePath:string,
    content: string
}) : void => {
    console.log('onFileCommand at', path.join(BASE_DIR, path.dirname(command.filePath)));
    if(command.filePath){
        fs.mkdirSync(path.join(BASE_DIR, path.dirname(command.filePath)), { recursive: true });
        fs.writeFileSync(path.join(BASE_DIR, command.filePath),  command.content);
    }
}

