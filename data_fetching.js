document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch and display the tree
    function loadTreeData() {
      fetch('/get-features')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const treeData = buildTree(data);
          $('#jstree_demo').jstree(true).settings.core.data = treeData;
          $('#jstree_demo').jstree(true).refresh(); // Refresh the tree with new data
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  
    // Initial loading of tree data
    loadTreeData();
  
    // Handle node click event
    $('#jstree_demo').on('select_node.jstree', function (e, data) {
      const selectedNode = data.node.text;
      const treeInstance = $.jstree.reference('#jstree_demo');
      selectedNodePath = getFullPath(data.node, treeInstance); // Store the full path of the selected node
  
      // Log the full path
      console.log('Selected Node Path:', selectedNodePath);
  
      // Extract the com_device or quantity details from the selected node's text
      const comDevice = selectedNode.includes('com_device') ? selectedNode.split(': ')[1] : '';
      const quantity = selectedNode.includes('Quantity') ? selectedNode.split(': ')[1] : '';
  
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
    document.querySelector('.close').onclick = function () {
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
          parent_project: parentProject, // Include the parent project name
          path: selectedNodePath, // Send full path for backend identification
          updated_data: updatedData
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          document.getElementById('editModal').style.display = "none"; // Close modal
  
          // Refresh the tree data from backend
          loadTreeData();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
  });
  