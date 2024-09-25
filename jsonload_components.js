data = {
        "kornbot380@hotmail.com": {
    "Smart_Robots": {
      "components": {
        "Communication_system": {
          "SIM900.glb": {
            "Quantity": "1", 
            "com_device": "/dev/ttyUSB0"
          }
        }, 
        "Motion_system": {
          "Mechanum_upgrade_edited.gltf": {
            "Quantity": "1", 
            "com_device": "/dev/ttyUSB0"
          }
        }, 
        "Odometry_system": {
          "Radarmodule.gltf": {
            "Quantity": "1", 
            "com_device": {}
          }
        }, 
        "Sensor_array_to_image_system": {
          "KS109-485-Ultrasonics__arrray.glb": {
            "Quantity": "1", 
            "com_device": {}
          }
        }, 
        "Vision_system": {
          "Fish_eye_lens_camera.gltf": {
            "Quantity": "1", 
            "com_device": "/dev/ttyUSB0"
          }, 
          "rpiCamera.glb": {
            "Quantity": "1", 
            "com_device": "/dev/ttyUSB0"
          }
        }
      }
    }
  }
    }
function jsonToJsTreeData(json) {
        let result = [];

        function traverse(obj, parentName = '') {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && !obj[key].hasOwnProperty('Quantity')) {
                    let node = {
                        id: parentName + key,
                        text: key,
                        children: []
                    };
                    node.children = traverse(obj[key], parentName + key + '/');
                    result.push(node);
                } else if (obj[key].hasOwnProperty('Quantity')) {
                    // Handle files with metadata
                    result.push({
                        id: parentName + key,
                        text: key,
                        data: obj[key] // Store the metadata
                    });
                }
            }
            return result;
        }

        traverse(json);
        return result;
    }
var output =jsonToJsTreeData(data);
console.log(output);
