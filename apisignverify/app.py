from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from sign_verify import verify_signatures  # Make sure sign_verify.py is in the same directory or adjust the import path accordingly
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/verify_signatures', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({"error": "Missing images"}), 400
    file1 = request.files['image1']
    file2 = request.files['image2']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file1.filename == '' or file2.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file1 and allowed_file(file1.filename) and file2 and allowed_file(file2.filename):
        filename1 = secure_filename(file1.filename)
        filename2 = secure_filename(file2.filename)
        filepath1 = os.path.join(app.config['UPLOAD_FOLDER'], filename1)
        filepath2 = os.path.join(app.config['UPLOAD_FOLDER'], filename2)
        file1.save(filepath1)
        file2.save(filepath2)
        # Run the verification
        match_result, similarity_score, folder_name = verify_signatures(filepath1, filepath2)
        # Return the result
        return jsonify({
            "match_result": match_result,
            "similarity_score": similarity_score,
            "data_folder": folder_name
        })

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create the upload folder if it doesn't exist
    app.run(debug=True)