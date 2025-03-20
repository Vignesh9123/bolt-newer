// /**
//  * Parser for Bolt Artifact XML to JSON
//  * Handles nested boltAction elements and their attributes
//  */
// function parseBoltArtifactXML(xmlString) {
//     // Create a DOM parser to handle the XML
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
//     // Find the root boltArtifact element
//     const artifactElement = xmlDoc.querySelector("boltArtifact");
    
//     if (!artifactElement) {
//       throw new Error("No boltArtifact element found in the XML");
//     }
    
//     // Parse the root boltArtifact
//     const artifact:{
//       id: any,
//       title: any,
//       actions: any
//     } = {
//       id: artifactElement.getAttribute("id"),
//       title: artifactElement.getAttribute("title"),
//       actions: [{
//         type: "" as "file" | "shell",
//         attributes: {},
//         content: ''
//       }]
//     };
    
//     // Process all boltAction elements
//     const actionElements = artifactElement.querySelectorAll("boltAction");
    
//     actionElements.forEach(actionElement => {
//       const action:{
//         type: "file" | "shell",
//         attributes: any,
//         content?: string 
//       } = {
//         type: actionElement.getAttribute("type") as "file" | "shell",
//         attributes: {},
//         content: ''
//       };
      
//       // Add all other attributes to the attributes object
//       Array.from(actionElement.attributes).forEach((attr: any) => {
//         if (attr.name !== "type") {
//           action.attributes[attr.name] = attr.value;
//         }
//       });
      
//       // Add the content of the action
//       action.content = actionElement.textContent?.trim();
      
//       artifact.actions.push(action);
//     });
    
//     return artifact;
//   }
  
//   /**
//    * Usage example:
//    * 
//    * const xmlString = `<boltArtifact id="chess-app-with-icons-2" title="Chess App with Icons">
//    *   <boltAction type="file" filePath="package.json">...</boltAction>
//    *   <boltAction type="shell">...</boltAction>
//    * </boltArtifact>`;
//    * 
//    * const jsonResult = parseBoltArtifactXML(xmlString);
//    * console.log(JSON.stringify(jsonResult, null, 2));
//    */
  
//   // For Node.js environment (requires the JSDOM package)
//   import { JSDOM } from 'jsdom';
//   function parseBoltArtifactXMLNode(xmlString) {
//     const dom = new JSDOM(xmlString);
//     const document = dom.window.document;
    
//     // Find the root boltArtifact element
//     const artifactElement = document.querySelector("boltArtifact");
    
//     if (!artifactElement) {
//       throw new Error("No boltArtifact element found in the XML");
//     }
    
//     // Parse the root boltArtifact
//     const artifact:{
//       id: any,
//       title: any,
//       actions: any
//     } = {
//       id: artifactElement.getAttribute("id"),
//       title: artifactElement.getAttribute("title"),
//       actions: []
//     };
    
//     // Process all boltAction elements
//     const actionElements = artifactElement.querySelectorAll("boltAction");
    
//     actionElements.forEach(actionElement => {
//       const action:{
//         type: "file" | "shell",
//         attributes: any,
//         content?: string
//       } = {
//         type: actionElement.getAttribute("type") as "file" | "shell",
//         attributes: {},
//         content: ''
//       };
      
//       // Add all other attributes to the attributes object
//       Array.from(actionElement.attributes).forEach((attr: any) => {
//         if (attr.name !== "type") {
//           action.attributes[attr.name] = attr.value;
//         }
//       });
      
//       // Add the content of the action
//       action.content = actionElement.textContent?.trim();
      
//       artifact.actions.push(action);
//     });
    
//     return artifact;
//   }
  
//   // A more robust version that works with both browser and Node.js environments
//   function parseXML(xmlString) {
//     // Check if we're in a browser or Node.js environment
//     const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    
//     if (isBrowser) {
//       return parseBoltArtifactXML(xmlString);
//     } else {
//       // Node.js environment
//       return parseBoltArtifactXMLNode(xmlString);
//     }
//   }
  
//   export { parseXML, parseBoltArtifactXML, parseBoltArtifactXMLNode };

// Above code fails render <Stack.Screen /> kind of elements - One workaround is to use <![CDATA[...]]> to wrap the content but we better use a custom parser to handle this kind of content



const sampleString = "\n<boltArtifact id=\"course-app\" title=\"Course App\">\n  <boltAction type=\"file\" filePath=\"package.json\">\n{\n  \"name\": \"course-app\",\n  \"version\": \"1.0.0\",\n  \"main\": \"node_modules/expo/AppEntry.js\",\n  \"scripts\": {\n    \"start\": \"expo start\",\n    \"android\": \"expo start --android\",\n    \"ios\": \"expo start --ios\",\n    \"web\": \"expo start --web\"\n  },\n  \"dependencies\": {\n    \"@expo/vector-icons\": \"^13.0.0\",\n    \"@react-navigation/bottom-tabs\": \"^6.5.11\",\n    \"@react-navigation/native\": \"^6.1.9\",\n    \"@react-navigation/native-stack\": \"^6.9.17\",\n    \"expo\": \"~49.0.15\",\n    \"expo-linear-gradient\": \"~12.3.0\",\n    \"expo-status-bar\": \"~1.6.0\",\n    \"react\": \"18.2.0\",\n    \"react-native\": \"0.72.6\",\n    \"react-native-safe-area-context\": \"4.6.3\",\n    \"react-native-screens\": \"~3.22.0\",\n    \"react-native-svg\": \"13.9.0\",\n    \"react-native-webview\": \"13.2.2\"\n  },\n  \"devDependencies\": {\n    \"@babel/core\": \"^7.20.0\",\n    \"@types/react\": \"~18.2.14\",\n    \"typescript\": \"^5.1.3\"\n  },\n  \"private\": true\n}\n  </boltAction>\n  <boltAction type=\"shell\">\n    npm install\n  </boltAction>\n  <boltAction type=\"file\" filePath=\"app/_layout.tsx\">\n    import { Stack } from 'expo-router';\n    import { useFonts } from 'expo-font';\n    import * as SplashScreen from 'expo-splash-screen';\n    import { useEffect } from 'react';\n    \n    SplashScreen.preventAutoHideAsync();\n    \n    export default function Layout() {\n      const [fontsLoaded] = useFonts({\n        'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),\n        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),\n      });\n    \n      useEffect(() => {\n        async function prepare() {\n          if (fontsLoaded) {\n            await SplashScreen.hideAsync();\n          }\n        }\n        prepare();\n      }, [fontsLoaded]);\n    \n      if (!fontsLoaded) {\n        return null;\n      }\n    \n      return (\n        <Stack>\n          <Stack.Screen name=\"index\" options={{ headerShown: false, title: 'Home' }} />\n          <Stack.Screen name=\"course-details\" options={{ headerShown: false, title: 'Course Details' }} />\n        </Stack>\n      );\n    }\n  </boltAction>\n  <boltAction type=\"file\" filePath=\"app/index.tsx\">\n    import React from 'react';\n    import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';\n    import { Link } from 'expo-router';\n    \n    const courses = [\n      { id: '1', title: 'Introduction to React Native', description: 'Learn the basics of React Native development.' },\n      { id: '2', title: 'Advanced JavaScript Concepts', description: 'Deep dive into advanced JavaScript topics.' },\n      { id: '3', title: 'Node.js for Beginners', description: 'Get started with backend development using Node.js.' },\n    ];\n    \n    const CourseItem = ({ course }: { course: { id: string; title: string; description: string } }) => (\n      <TouchableOpacity style={styles.courseItem}>\n        <Link href={\`/course-details?id=\${course.id}\`} asChild>\n          <View>\n            <Text style={styles.courseTitle}>{course.title}</Text>\n            <Text style={styles.courseDescription}>{course.description}</Text>\n          </View>\n        </Link>\n      </TouchableOpacity>\n    );\n    \n    export default function Home() {\n      return (\n        <View style={styles.container}>\n          <Text style={styles.header}>Available Courses</Text>\n          <FlatList\n            data={courses}\n            keyExtractor={(item) => item.id}\n            renderItem={({ item }) => <CourseItem course={item} />}\n          />\n        </View>\n      );\n    }\n    \n    const styles = StyleSheet.create({\n      container: {\n        flex: 1,\n        padding: 20,\n        backgroundColor: '#f0f0f0',\n      },\n      header: {\n        fontSize: 24,\n        fontWeight: 'bold',\n        marginBottom: 20,\n        textAlign: 'center',\n      },\n      courseItem: {\n        backgroundColor: 'white',\n        padding: 15,\n        marginBottom: 10,\n        borderRadius: 8,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 2 },\n        shadowOpacity: 0.1,\n        shadowRadius: 2,\n        elevation: 3,\n      },\n      courseTitle: {\n        fontSize: 18,\n        fontWeight: 'bold',\n        color: '#333',\n      },\n      courseDescription: {\n        fontSize: 14,\n        color: '#666',\n        marginTop: 5,\n      },\n    });\n  </boltAction>\n  <boltAction type=\"file\" filePath=\"app/course-details.tsx\">\n    import React from 'react';\n    import { View, Text, StyleSheet } from 'react-native';\n    import { useSearchParams } from 'expo-router';\n    \n    export default function CourseDetails() {\n      const { id } = useSearchParams();\n    \n      // Replace with actual data fetching or state management\n      const courseDetails = {\n        '1': { title: 'Introduction to React Native', content: 'This course covers the fundamentals of React Native.' },\n        '2': { title: 'Advanced JavaScript Concepts', content: 'Explore advanced JavaScript concepts in detail.' },\n        '3': { title: 'Node.js for Beginners', content: 'Learn how to build server-side applications with Node.js.' },\n      }[id as string] || { title: 'Course Not Found', content: 'No course found with this ID.' };\n    \n      return (\n        <View style={styles.container}>\n          <Text style={styles.title}>{courseDetails.title}</Text>\n          <Text style={styles.content}>{courseDetails.content}</Text>\n        </View>\n      );\n    }\n    \n    const styles = StyleSheet.create({\n      container: {\n        flex: 1,\n        padding: 20,\n        backgroundColor: '#fff',\n      },\n      title: {\n        fontSize: 22,\n        fontWeight: 'bold',\n        marginBottom: 15,\n        color: '#333',\n      },\n      content: {\n        fontSize: 16,\n        color: '#444',\n      },\n    });\n  </boltAction>\n  <boltAction type=\"file\" filePath=\"assets/fonts/Roboto-Regular.ttf\"></boltAction>\n  <boltAction type=\"file\" filePath=\"assets/fonts/Roboto-Bold.ttf\"></boltAction>\n</boltArtifact>"



// Below function works well for one-shot response But for updated streaming response It fails miserably
// export function parseXML(xmlString: string) {
//   const givenString = xmlString;
//   const result:{
//     id: string
//     title: string
//     actions: {
//       type: "file" | "shell";
//       attributes: {
//         filepath?: string;
//       };
//       content?: string;
//     }[]
//   } = {
//     id: "",
//     title: "",
//     actions: []
//   }
//   if(!givenString){
//     return result
//   }
//   const artifactString = givenString.split("<boltArtifact")[1]?.split("</boltArtifact>")[0];
//   const id = artifactString.split("id=\"")[1].split("\"")[0];
//   result.id = id;
//   const title = artifactString.split("title=\"")[1].split("\"")[0];
//   result.title = title;

//   // console.log('artifactString', artifactString);
//   const actionsString = artifactString.split(`title="${title}">`)[1];
//   // console.log('actionsString', actionsString);
//   /*
//   <boltAction type="file" filePath="package.json">
// {
//   "name": "course-app",
//   "version": "1.0.0",
//   "main": "node_modules/expo/AppEntry.js",
//   "scripts": {
//     "start": "expo start",
//     "android": "expo start --android",
//     "ios": "expo start --ios",
//     "web": "expo start --web"
//   },
//   "dependencies": {
//     "@expo/vector-icons": "^13.0.0",
//     "@react-navigation/bottom-tabs": "^6.5.11",
//     "@react-navigation/native": "^6.1.9",
//     "@react-navigation/native-stack": "^6.9.17",
//     "expo": "~49.0.15",
//     "expo-linear-gradient": "~12.3.0",
//     "expo-status-bar": "~1.6.0",
//     "react": "18.2.0",
//     "react-native": "0.72.6",
//     "react-native-safe-area-context": "4.6.3",
//     "react-native-screens": "~3.22.0",
//     "react-native-svg": "13.9.0",
//     "react-native-webview": "13.2.2"
//   },
//   "devDependencies": {
//     "@babel/core": "^7.20.0",
//     "@types/react": "~18.2.14",
//     "typescript": "^5.1.3"
//   },
//   "private": true
// }
//   </boltAction>
//   <boltAction type="shell">
//     npm install
//   </boltAction>
//   <boltAction type="file" filePath="app/_layout.tsx">
//     import { Stack } from 'expo-router';
//     import { useFonts } from 'expo-font';
//     import * as SplashScreen from 'expo-splash-screen';
//     import { useEffect } from 'react';

//     SplashScreen.preventAutoHideAsync();

//     export default function Layout() {
//       const [fontsLoaded] = useFonts({
//         'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
//         'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
//       });

//       useEffect(() => {
//         async function prepare() {
//           if (fontsLoaded) {
//             await SplashScreen.hideAsync();
//           }
//         }
//         prepare();
//       }, [fontsLoaded]);

//       if (!fontsLoaded) {
//         return null;
//       }

//       return (
//         <Stack>
//           <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
//           <Stack.Screen name="course-details" options={{ headerShown: false, title: 'Course Details' }} />
//         </Stack>
//       );
//     }
//   </boltAction>
//   <boltAction type="file" filePath="app/index.tsx">
//     import React from 'react';
//     import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
//     import { Link } from 'expo-router';

//     const courses = [
//       { id: '1', title: 'Introduction to React Native', description: 'Learn the basics of React Native development.' },
//       { id: '2', title: 'Advanced JavaScript Concepts', description: 'Deep dive into advanced JavaScript topics.' },
//       { id: '3', title: 'Node.js for Beginners', description: 'Get started with backend development using Node.js.' },
//     ];

//     const CourseItem = ({ course }: { course: { id: string; title: string; description: string } }) => (
//       <TouchableOpacity style={styles.courseItem}>
//         <Link href={`/course-details?id=${course.id}`} asChild>
//           <View>
//             <Text style={styles.courseTitle}>{course.title}</Text>
//             <Text style={styles.courseDescription}>{course.description}</Text>
//           </View>
//         </Link>
//       </TouchableOpacity>
//     );

//     export default function Home() {
//       return (
//         <View style={styles.container}>
//           <Text style={styles.header}>Available Courses</Text>
//           <FlatList
//             data={courses}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => <CourseItem course={item} />}
//           />
//         </View>
//       );
//     }

//     const styles = StyleSheet.create({
//       container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f0f0f0',
//       },
//       header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//       },
//       courseItem: {
//         backgroundColor: 'white',
//         padding: 15,
//         marginBottom: 10,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 3,
//       },
//       courseTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//       },
//       courseDescription: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 5,
//       },
//     });
//   </boltAction>
//   <boltAction type="file" filePath="app/course-details.tsx">
//     import React from 'react';
//     import { View, Text, StyleSheet } from 'react-native';
//     import { useSearchParams } from 'expo-router';

//     export default function CourseDetails() {
//       const { id } = useSearchParams();

//       // Replace with actual data fetching or state management
//       const courseDetails = {
//         '1': { title: 'Introduction to React Native', content: 'This course covers the fundamentals of React Native.' },
//         '2': { title: 'Advanced JavaScript Concepts', content: 'Explore advanced JavaScript concepts in detail.' },
//         '3': { title: 'Node.js for Beginners', content: 'Learn how to build server-side applications with Node.js.' },
//       }[id as string] || { title: 'Course Not Found', content: 'No course found with this ID.' };

//       return (
//         <View style={styles.container}>
//           <Text style={styles.title}>{courseDetails.title}</Text>
//           <Text style={styles.content}>{courseDetails.content}</Text>
//         </View>
//       );
//     }

//     const styles = StyleSheet.create({
//       container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//       },
//       title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         color: '#333',
//       },
//       content: {
//         fontSize: 16,
//         color: '#444',
//       },
//     });
//   </boltAction>
//   <boltAction type="file" filePath="assets/fonts/Roboto-Regular.ttf"></boltAction>
//   <boltAction type="file" filePath="assets/fonts/Roboto-Bold.ttf"></boltAction>
//   */

//   let content = ""
//   const action:{
//     type: "file" | "shell",
//     attributes: {
//       filepath?: string
//     },
//     content?: string
//   } = {
//     type: "" as "file" | "shell",
//     attributes: {},
//   }
//   const actions:any = []
//   actionsString.split("\n").forEach((actionString) => {
//     if (actionString.trim().startsWith("<boltAction")) {
//       const type = actionString.match(/type="([^"]+)"/)?.[1];
//       action.type = type == "file" ? "file" : "shell"
//       // console.log("type", type);
//       if(type == "file"){
//       const filePath = actionString.match(/filePath="([^"]+)"/)?.[1];
//       action.attributes.filepath = filePath ? filePath.trim() : ""
//       console.log("filePath", filePath);
//       }
//     }
//     else if(actionString.trim().startsWith("</boltAction")) {
//       // console.log("content", content.trim());
//       if(content) action.content = content.trim()
//       actions.push({...action})
//       action.type = "" as "file" | "shell"
//       action.attributes = {}
//       action.content = ""
//       // console.log("action", action);
//       content = ""
      
//     }
//     else {content += actionString + "\n";}
//   });

//   // console.log("Actions:", actions);
//   result.actions = actions
//   // console.log("result", result);
//   return result
// }

// parseXML(sampleString);

/* Now we will hence try to write a parser that can handle streaming responses */

export class XMLParser {
  public currentString: string;
  private onFileCommand: (filePath: string, content: string) => void;
  private onShellCommand: (content: string) => void;
  constructor(data:{currentString?: string, onFileCommand?: (filePath: string, content: string) => void, onShellCommand?: (content: string) => void}) {
    this.currentString = data.currentString || "";
    this.onFileCommand = data.onFileCommand || (() => {});
    this.onShellCommand = data.onShellCommand || (() => {});
  }
  append(string: string) {
    this.currentString += string;
  }
  parse():string | undefined {
    // console.log("Current String", this.currentString);
    const actionStart = this.currentString.split("\n").findIndex((line) => line.trim().startsWith("<boltAction"));
    if(actionStart == -1){
      const actionEnd = this.currentString.split("\n").findIndex((line) => line.trim().startsWith("</boltAction"));
      if(actionEnd == -1) return;
      else throw new Error("Invalid XML");
    }
    this.currentString = this.currentString.split("\n").slice(actionStart).join("\n");
    const actionEnd = this.currentString.split("\n").findIndex((line) => line.trim().startsWith("</boltAction"));
    if(actionEnd == -1){
      return;
    }
    const actionString = this.currentString.split("\n").slice(0, actionEnd + 1).join("\n");
    // console.log("actionString", actionString);
    const type = actionString.match(/type="([^"]+)"/)?.[1];
    console.log("type", type);
    const content = actionString.split("\n").slice(1, -1).join("\n").split("<![CDATA[").join("").split("]]>").join("")
    if(type == "file") {
      const filePath = actionString.match(/filePath="([^"]+)"/)?.[1] ;
      if(!filePath) console.warn("File path not found");
      console.log("filePath", filePath);
      this.onFileCommand(filePath || 'sample.txt', content);
    }
    else if(type == "shell") {
      this.onShellCommand(content);
    }
    this.currentString = this.currentString.split("\n").slice(actionEnd + 1).join("\n");
    if(this.currentString.trim().startsWith("<boltAction")) {
      // console.log("Content", content.trim());
      return content?.split('\n').map((line) => line.trim()).join('\n') + this.parse() || ""; // Use this for only test purposes else we can comment this line
      // return this.parse(); // Use this if not testing the parser
    } 
    // console.log("Content", content.trim());
    return content.trim() || ""; // Use this for only test purposes else we can comment this line
  }
}

interface Artifact {
  id: string;
  title: string;
  actions: {
    type: "file" | "shell";
    attributes: {
      filePath?: string;
    };
    content?: string;
  }[];
}

