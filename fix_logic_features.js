
    let selectedNodePath = ''; // Store the selected node's full path
    let selectedNodeData = {}; // Store the selected node's data (com_device, quantity)
    let parentProject = ''; // Store the parent project name
    var email = document.getElementById('email').value;

    // Function to build tree data from JSON payload
    function buildTree(obj) {
        const result = [];
        for (let key in obj) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                const children = buildTree(obj[key]);
                result.push({
                    text: key,
                    children: children
                });
            } else {
                result.push({ text: `${key}: ${obj[key]}` });
            }
        }
        return result;
    }

    // Function to get the full path of the selected node
    function getFullPath(node, treeInstance) {
        const parents = treeInstance.get_path(node, '/'); // Get the path with '/' separator
        return parents;
    }

    // Open modal and populate fields for editing
    function openModal(nodeData, projectName) {
        document.getElementById('editModal').style.display = "block";
        document.getElementById('com_device').value = nodeData.com_device || '';
        document.getElementById('quantity').value = nodeData.quantity || '';
        parentProject = projectName; // Set the parent project name
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Fetch JSON data from the backend
        fetch('/features_components')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const treeData = buildTree(data[email]);
                $('#jstree_demo').jstree({
                    'core': {
                        'data': treeData
                    }
                });

                // Handle node click event
                $('#jstree_demo').on('select_node.jstree', function (e, data) {
                    const selectedNode = data.node.text;
                    const treeInstance = $.jstree.reference('#jstree_demo');
                    selectedNodePath = getFullPath(data.node, treeInstance); // Store the full path of the selected node

                    // Extract the com_device and quantity details from the selected node's text
                    let comDevice = '';
                    let quantity = '';

                    // Loop through each child node to check if it contains com_device or Quantity
                    data.node.children_d.forEach((childId) => {
                        const childNode = treeInstance.get_node(childId);
                        if (childNode.text.includes('com_device')) {
                            comDevice = childNode.text.split(': ')[1];
                        } else if (childNode.text.includes('Quantity')) {
                            quantity = childNode.text.split(': ')[1];
                        }
                    });

                    // If the current node contains com_device or Quantity, also capture that
                    if (selectedNode.includes('com_device')) {
                        comDevice = selectedNode.split(': ')[1];
                    } else if (selectedNode.includes('Quantity')) {
                        quantity = selectedNode.split(': ')[1];
                    }

                    // Populate selectedNodeData with both com_device and quantity
                    selectedNodeData = {
                        com_device: comDevice,
                        quantity: quantity
                    };

                    // Determine the parent project name
                    const projectName = selectedNodePath[0]; // Assuming the first element in the path is the project name
                    
                    // Open modal with pre-filled values
                    if (comDevice || quantity) {
                        openModal(selectedNodeData, projectName);
                    }
                });

                // Close modal
                document.querySelector('.close').onclick = function() {
                    document.getElementById('editModal').style.display = "none";
                };

                // Save changes and send to backend
                document.getElementById('saveChanges').onclick = function () {
                    const updatedData = {
                        com_device: document.getElementById('com_device').value,
                        quantity: document.getElementById('quantity').value
                    };

                    // Send updated data back to the backend
                    fetch('/update-feature', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'email':email,
                            'parent_project': parentProject, // Include the parent project name
                            'path': selectedNodePath, // Send full path for backend identification
                            'updated_data': updatedData
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Parent path directory: ', selectedNodePath);
                        console.log('Success:', data);
                        document.getElementById('editModal').style.display = "none"; // Close modal
                        location.reload(); // Refresh the page to get updated data
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                };

                // Delete selected node
                document.getElementById('deleteNode').onclick = function () {
                    // Send delete request to the backend
                    fetch('/delete-feature', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'email':email,
                            'parent_project': parentProject, // Include the parent project name
                            'path': selectedNodePath // Send full path for backend identification
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Deleted:', data);
                        document.getElementById('editModal').style.display = "none"; // Close modal
                        location.reload(); // Refresh the page to reflect the deletion
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                };
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

