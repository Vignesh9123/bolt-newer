import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.join(__dirname, 'tmp');

console.log('BASE_DIR', BASE_DIR);

export const onShellCommand = (command:string) : void => {
    console.log('onShellCommand', command);
    const child = exec(`cd ${BASE_DIR} && ${command}`)

    child.stdout?.on('data', (data) => {
        console.log(`stdout: ${data}`); // This is realtime,  stream this to code-server (not a good idea as we cannot control what to show on terminal (UGLY WAY, pass echo commands using a custom vscode extension)), or stream this to frontend
    });
    
    child.stderr?.on('data', (data) => {
        console.error(`stderr: ${data}`);// This is realtime,  stream this to code-server (not a good idea as we cannot control what to show on terminal (UGLY WAY, pass echo commands using a custom vscode extension)), or stream this to frontend
    });
    
    child.on('exit', (code, signal) => {
        console.log(`child process exited with code ${code} and signal ${signal}`); // stream this to frontend that the shell command is done and moving to next command
    });
    
}

onShellCommand('node test.js');
// Content of test.js in BASE_DIR:
/*
async function main(){
    console.log("hello world")
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("hello world 2")
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("hello world 3")
}

main()
*/
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