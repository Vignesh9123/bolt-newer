import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.join(__dirname, '..', 'tmp');

console.log('BASE_DIR', BASE_DIR);

export const onShellCommand = (command:string) : void => {
    console.log('onShellCommand', command);
    spawn(command, { shell: true, stdio: 'inherit',cwd: BASE_DIR });
}

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