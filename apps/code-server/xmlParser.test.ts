import { test } from 'node:test';
import assert from 'node:assert';
import { XMLParser } from './xmlParser';

// TODO: Update tests to include file and shell commands using the callback functions in the XMLParser class
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
    // Arrange
    const fileCommands: Array<{filePath: string, content: string}> = [];
    const parser = new XMLParser({});

    // Act
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
    // Assert
    // assert.strictEqual(fileCommands.length, 1);
    // assert.strictEqual(fileCommands[0].filePath, 'app/_layout.tsx');
    assert.ok(content?.includes('<Stack.Screen'));
    assert.ok(content?.includes('headerShown: false'));
});