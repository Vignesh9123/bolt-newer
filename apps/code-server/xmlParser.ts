/**
 * Parser for Bolt Artifact XML to JSON
 * Handles nested boltAction elements and their attributes
 */
function parseBoltArtifactXML(xmlString) {
    // Create a DOM parser to handle the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Find the root boltArtifact element
    const artifactElement = xmlDoc.querySelector("boltArtifact");
    
    if (!artifactElement) {
      throw new Error("No boltArtifact element found in the XML");
    }
    
    // Parse the root boltArtifact
    const artifact:{
      id: any,
      title: any,
      actions: any
    } = {
      id: artifactElement.getAttribute("id"),
      title: artifactElement.getAttribute("title"),
      actions: [{
        type: "" as "file" | "shell",
        attributes: {},
        content: ''
      }]
    };
    
    // Process all boltAction elements
    const actionElements = artifactElement.querySelectorAll("boltAction");
    
    actionElements.forEach(actionElement => {
      const action:{
        type: "file" | "shell",
        attributes: any,
        content?: string 
      } = {
        type: actionElement.getAttribute("type") as "file" | "shell",
        attributes: {},
        content: ''
      };
      
      // Add all other attributes to the attributes object
      Array.from(actionElement.attributes).forEach((attr: any) => {
        if (attr.name !== "type") {
          action.attributes[attr.name] = attr.value;
        }
      });
      
      // Add the content of the action
      action.content = actionElement.textContent?.trim();
      
      artifact.actions.push(action);
    });
    
    return artifact;
  }
  
  /**
   * Usage example:
   * 
   * const xmlString = `<boltArtifact id="chess-app-with-icons-2" title="Chess App with Icons">
   *   <boltAction type="file" filePath="package.json">...</boltAction>
   *   <boltAction type="shell">...</boltAction>
   * </boltArtifact>`;
   * 
   * const jsonResult = parseBoltArtifactXML(xmlString);
   * console.log(JSON.stringify(jsonResult, null, 2));
   */
  
  // For Node.js environment (requires the JSDOM package)
  import { JSDOM } from 'jsdom';
  function parseBoltArtifactXMLNode(xmlString) {
    const dom = new JSDOM(xmlString);
    const document = dom.window.document;
    
    // Find the root boltArtifact element
    const artifactElement = document.querySelector("boltArtifact");
    
    if (!artifactElement) {
      throw new Error("No boltArtifact element found in the XML");
    }
    
    // Parse the root boltArtifact
    const artifact:{
      id: any,
      title: any,
      actions: any
    } = {
      id: artifactElement.getAttribute("id"),
      title: artifactElement.getAttribute("title"),
      actions: []
    };
    
    // Process all boltAction elements
    const actionElements = artifactElement.querySelectorAll("boltAction");
    
    actionElements.forEach(actionElement => {
      const action:{
        type: "file" | "shell",
        attributes: any,
        content?: string
      } = {
        type: actionElement.getAttribute("type") as "file" | "shell",
        attributes: {},
        content: ''
      };
      
      // Add all other attributes to the attributes object
      Array.from(actionElement.attributes).forEach((attr: any) => {
        if (attr.name !== "type") {
          action.attributes[attr.name] = attr.value;
        }
      });
      
      // Add the content of the action
      action.content = actionElement.textContent?.trim();
      
      artifact.actions.push(action);
    });
    
    return artifact;
  }
  
  // A more robust version that works with both browser and Node.js environments
  function parseXML(xmlString) {
    // Check if we're in a browser or Node.js environment
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    
    if (isBrowser) {
      return parseBoltArtifactXML(xmlString);
    } else {
      // Node.js environment
      return parseBoltArtifactXMLNode(xmlString);
    }
  }
  
  export { parseXML, parseBoltArtifactXML, parseBoltArtifactXMLNode };