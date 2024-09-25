import requests
from flask import Flask, render_template, jsonify,request,url_for,redirect

app = Flask(__name__)

@app.route('/<datauser>')
def index(datauser):
    return render_template('index3.html',useraccount=datauser)
@app.route('/projectload')
def index_projectloader():
    
     return render_template('index4.html')
@app.route('/predata/<accountdata>')
def predata_input(accountdata):
     
     return render_template('index6.html',userdata=accountdata,encodejwt=accountdata) 
@app.route("/load_selected_features/<accountuser>")
def load_selected_features(accountuser):

     return render_template('index5.html',datauser=accountuser)
# New API endpoint to provide updated JSON data
@app.route('/get-json')
def get_json():
    req_docmath = requests.get("http://192.168.50.247:7884/doccompmatch_total")
    updated_data = req_docmath.json()
    return jsonify(updated_data)
#Selected current components data 
@app.route('/features_components')
def get_featuresfunc():
    req_features  = requests.get("http://192.168.50.247:4678/get_total_project")
    updatefeatures = req_features.json()
    return jsonify(updatefeatures) 
@app.route('/update-feature', methods=['POST'])
def update_feature():
    data = request.json
    email = data.get('email')
    parent_project = data.get('parent_project')  # Get the parent project name
    path = data.get('path')  # Get the path of the node
    updated_data = data.get('updated_data')  # Get the updated values for com_device or quantity
    # You can update the payload or perform database updates here based on the path
    print(f"Email {email} at Updating {parent_project} at path: {path} with data: {updated_data}")
    #Send post request data of the payload project
    path_struct = path.split('/')
    payload_structure = {email:{'project_name':path_struct[0],'subcategory':path_struct[2],'filename':path_struct[3],'Quantity':path_struct[4].split(" ")[1],'com_device':updated_data}}
    print("Reconstruct payload: ",payload_structure) 
    req_post_recon = requests.post("http://192.168.50.247:4678/update_projectnode",json=payload_structure)
    print("Post back the reconstruction payload: ",req_post_recon)
    return jsonify(data)
@app.route('/delete-feature',methods=['POST'])
def delete_features_processing():
      req_json = request.json
      #print("Return delete_selected payload",req_json)
      email = req_json.get('email')
      #parent_project = req_json.get('parent_project')
      path_project = req_json.get('path')
      #print("Project path data: ",email,parent_project,path_project.split('/'))
      path_struct = path_project.split('/') # Get the path data structure 
      recons_payload = {email:{'project_name':path_struct[0],'subcategory':path_struct[2],'filename':path_struct[3],'Quantity':path_struct[4]}}
      print('Payload reconstruct: ',recons_payload) 
      #Post request to the server of the 
      req_post_payload = requests.post("http://192.168.50.247:4678/delete_componentsnode",json=recons_payload) 
      print("Post back the edited features: ",req_post_payload)
      return jsonify(req_json)
@app.route('/delete_docmatching',methods=['POST','GET'])
def doc_match_delete():
     req_doc = request.get_json(force=True) 
     req_deldoc = requests.post("http://192.168.50.247:7884/deletedocmath",json=req_doc)
     print("Request document: ",req_doc)
     return jsonify(req_doc)
@app.route('/dynamicmodal')
def dynamicmodalfunc():
                
        return render_template('dynamic_modal.html')
@app.route('/dashboard')
def dash_menuprofile():
      print("https://roboreactor.com/motion_control/eyJlbWFpbCI6Imtvcm5ib3QzODBAaG90bWFpbC5jb20iLCJwcm9qZWN0X25hbWUiOiJTbWFydF9Sb2JvdHMifQ==")
      return render_template('profile.html')
if __name__ == '__main__':
    app.run(debug=True,threaded=True,host="0.0.0.0",port=5789)
