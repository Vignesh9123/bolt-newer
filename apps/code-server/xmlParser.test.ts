import { test } from 'node:test';
import assert from 'node:assert';
import { XMLParser } from './xmlParser';

// TODO: Make sure to uncomment the required lines in xmlParser.ts file before running these tests
test('XMLParser should parse file commands', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction type="file" filePath="apps/code-server/index.ts">
    `;
    xmlParser.append(xml);
    const xml2 = `console.log('Hello World');
    </boltAction>`;
    xmlParser.append(xml2);
    const result = xmlParser.parse();
    assert.equal(result?.trim(), 'console.log(\'Hello World\');');
})

test('XMLParser should parse shell commands', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction type="shell">
    npm install
    `;
    xmlParser.append(xml);
    const xml2 = `
    </boltAction>`;
    xmlParser.append(xml2);
    const result = xmlParser.parse();
    assert.equal(result?.trim(), 'npm install');
})

test('XMLParser should parse multiple commands', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction type="file" filePath="apps/code-server/index.ts">
    console.log('Hello World');
    `;
    xmlParser.append(xml);
    const xml2 = `
    </boltAction>
    <boltAction type="shell">
    npm install
    `;
    xmlParser.append(xml2);
    const xml3 = `
    </boltAction>`;
    xmlParser.append(xml3);
    const result = xmlParser.parse();
    assert.equal(result, 'console.log(\'Hello World\');\nnpm install');
})

test('XMLParser should parse multiple commands with multiple lines', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction type="file" filePath="apps/code-server/index.ts">
    console.log('Hello World');
    console.log('Hello World 2');
    `;
    xmlParser.append(xml);
    const xml2 = `
    </boltAction>
    <boltAction type="shell">
    npm install
    `;
    xmlParser.append(xml2);
    const xml3 = `
    </boltAction>`;
    xmlParser.append(xml3);
    const result = xmlParser.parse();
    assert.equal(result?.split('\n').map((line) => line.trim()).join('\n').trim(), 'console.log(\'Hello World\');\nconsole.log(\'Hello World 2\');\nnpm install');
})
test('XMLParser should throw error for invalid XML', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    console.log('Hello World');
    `;
    xmlParser.append(xml);
    const xml2 = `
    </boltAction>`;
    xmlParser.append(xml2);
    try {
        xmlParser.parse();
        assert.fail('Should throw error');
    } catch (e: any) {
        assert.equal(e.message, 'Invalid XML');
    }
})

test('XMLParser should parse extremely chunked XML', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction `
    xmlParser.append(xml);
    const xml2 = `type="file" filePath="apps/code-server/`
    xmlParser.append(xml2);
    const xml3 = `index.ts">
    console`
    xmlParser.append(xml3);
    const xml4 = `.log('Hello World');
    consol`;
    xmlParser.append(xml4);
    const xml5 = `e.log('Hello World 2');
    </boltAction>`;
    xmlParser.append(xml5);
    const xml6 = `
    <boltAction type="shell"`;
    xmlParser.append(xml6);
    const xml7 = `>`
    xmlParser.append(xml7);
    const xml8 = `
    npm install
    `;
    xmlParser.append(xml8);
    const xml9 = `
    </boltAction>`;
    const result1 = xmlParser.parse();
    assert.equal(result1?.split('\n').map((line) => line.trim()).join('\n').trim(), 'console.log(\'Hello World\');\nconsole.log(\'Hello World 2\');undefined');
    xmlParser.append(xml9);
    const result = xmlParser.parse();
    assert.equal(result?.split('\n').map((line) => line.trim()).join('\n').trim(), `npm install`);
})

test('XMLParser should handle nested JSX content', (t) => {
    const parser = new XMLParser({});

    parser.append(`
        <boltAction type="file" filePath="app/_layout.tsx">
            import { Stack } from 'expo-router';
            
            export default function Layout() {
                return (
                    <Stack>
                        <Stack.Screen 
                            name="index" 
                            options={{ 
                                headerShown: false, 
                                title: 'Home' 
                            }} 
                        />
                    </Stack>
                );
            }
        </boltAction>
    `);
    const content = parser.parse();
    assert.ok(content?.includes('<Stack.Screen'));
    assert.ok(content?.includes('headerShown: false'));
});



test('XMLParser should parse file content with CDATA tag wrapped around', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction type="file" filePath="app/component.tsx">
    <![CDATA[
        import React from 'react';
        
        export default function Component() {
            return (
                <div>
                    <CustomComponent 
                        prop={value > 0 && <span>Hello</span>}
                        data={{ key: "value" }}
                    />
                </div>
            );
        }
    ]]>
    </boltAction>
    `;
    xmlParser.append(xml);
    const result = xmlParser.parse();
    
    // Assert that the content is preserved exactly as is within CDATA
    assert.ok(result?.includes('<CustomComponent'));
    assert.ok(result?.includes('prop={value > 0'));
    assert.ok(result?.includes('<span>Hello</span>'));
    assert.ok(result?.includes('data={{ key: "value" }}'));
    // Check that the CDATA tags themselves are removed
    assert.ok(!result?.includes('CDATA'));
    assert.ok(!result?.includes(']]>'));
});

test('XMLParser should parse file content with CDATA tag wrapped around in multiple chunks', (t) => {
    const xmlParser = new XMLParser({});
    const xml = `
    <boltAction type="file" filePath="app/component.tsx">
    <![CDATA[
        import React from 'react';
        
        export default function Component() {
            return (
                <div>
                    <CustomComponent 
                        prop={value > 0 && <span>Hello</span>}
                        data={{ key: "value" }}
                    />
                </div>
                `
    xmlParser.append(xml);
    const xml2 = `
            );
        }
    ]]>
        </boltAction>`
    xmlParser.append(xml2);
    const result = xmlParser.parse();
    
    // Assert that the content is preserved exactly as is within CDATA
    assert.ok(result?.includes('<CustomComponent'));
    assert.ok(result?.includes('prop={value > 0'));
    assert.ok(result?.includes('<span>Hello</span>'));

    // Check that the CDATA tags themselves are removed
    assert.ok(!result?.includes('CDATA'));
    assert.ok(!result?.includes(']]>'));
});

test('XMLParser should handle onFileCommand function correctly', (t) => {
    
    let capturedFilePath = '';
    let capturedContent = '';
    const xmlParser = new XMLParser({
        onFileCommand: (filePath, content) => {
            capturedFilePath = filePath;
            capturedContent = content;
        }
    });

    const xml = `
    <boltAction type="file" filePath="src/App.tsx">
        import React from 'react';
        
        export default function App() {
            return <div>Hello World</div>;
        }
    </boltAction>
    `;
    xmlParser.append(xml);
    xmlParser.parse();

    assert.equal(capturedFilePath, 'src/App.tsx');
    assert.ok(capturedContent.includes('import React'));
    assert.ok(capturedContent.includes('export default function App'));
    assert.ok(capturedContent.includes('<div>Hello World</div>'));
});

test('XMLParser should handle onFileCommand function correctly for multiple file commands', (t) => {
    const capturedFiles: Array<{filePath: string, content: string}> = [];
    const xmlParser = new XMLParser({
        onFileCommand: (filePath, content) => {
            capturedFiles.push({ filePath, content });
        }
    });

    const xml = `
    <boltAction type="file" filePath="src/App.tsx">
        import React from 'react';
        export default function App() {
            return <div>Hello World</div>;
        }
    </boltAction>
    <boltAction type="file" filePath="src/styles.css">
        .container {
            padding: 20px;
        }
    </boltAction>
    <boltAction type="file" filePath="src/utils.ts">
        export function helper() {
            return 'helper';
        }
    </boltAction>
    `;
    xmlParser.append(xml);
    xmlParser.parse();

    assert.equal(capturedFiles.length, 3);
    
    // First file
    assert.equal(capturedFiles[0].filePath, 'src/App.tsx');
    assert.ok(capturedFiles[0].content.includes('import React'));
    assert.ok(capturedFiles[0].content.includes('<div>Hello World</div>'));

    // Second file
    assert.equal(capturedFiles[1].filePath, 'src/styles.css');
    assert.ok(capturedFiles[1].content.includes('.container'));
    assert.ok(capturedFiles[1].content.includes('padding: 20px'));

    // Third file
    assert.equal(capturedFiles[2].filePath, 'src/utils.ts');
    assert.ok(capturedFiles[2].content.includes('export function helper'));
    assert.ok(capturedFiles[2].content.includes('return \'helper\''));
});

test('XMLParser should handle onShellCommand function correctly', (t) => {
    const capturedCommands: string[] = [];
    const xmlParser = new XMLParser({
        onShellCommand: (content) => {
            capturedCommands.push(content);
        }
    });

    const xml = `
    <boltAction type="shell">
        npm install
    </boltAction>
    <boltAction type="shell">
        npm run build
    </boltAction>
    <boltAction type="shell">
        docker-compose up -d
    </boltAction>
    `;
    xmlParser.append(xml);
    xmlParser.parse();

    assert.equal(capturedCommands.length, 3);
    assert.equal(capturedCommands[0].trim(), 'npm install');
    assert.equal(capturedCommands[1].trim(), 'npm run build');
    assert.equal(capturedCommands[2].trim(), 'docker-compose up -d');
});