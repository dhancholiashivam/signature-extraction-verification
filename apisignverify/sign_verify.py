import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
import json
from shutil import copy2
from datetime import datetime

def verify_signatures(image1_path, image2_path):
    # Load images in grayscale
    img1 = cv2.imread(image1_path, cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imread(image2_path, cv2.IMREAD_GRAYSCALE)

    # Initialize SIFT detector
    sift = cv2.SIFT_create()

    # Find the keypoints and descriptors with SIFT
    kp1, des1 = sift.detectAndCompute(img1, None)
    kp2, des2 = sift.detectAndCompute(img2, None)

    # Create BFMatcher object with default params
    bf = cv2.BFMatcher()

    # Match descriptors
    matches = bf.knnMatch(des1, des2, k=2)

    # Apply ratio test to find good matches
    good_matches = []
    for m, n in matches:
        if m.distance < 0.75*n.distance:
            good_matches.append(m)

    # Optionally, draw good matches (for visualization)
    img3 = cv2.drawMatches(img1, kp1, img2, kp2, good_matches, None, flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
    plt.imshow(img3), plt.show()

    # Calculate similarity score based on good matches
    if len(good_matches) > 0:
        similarity_score = len(good_matches) / len(matches)
    else:
        similarity_score = 0

    # Decision based on the similarity score
    threshold = 0.1  # Example threshold, adjust based on your similarity score range and requirements
    if similarity_score > threshold:
        match_result = "Signatures are likely a match."
    else:
        match_result = "Signatures are not a match."

    # Parent directory for all case studies
    parent_dir = "case_studies"
    os.makedirs(parent_dir, exist_ok=True)  # Ensure the parent directory exists

    # Extract base names without extension
    image1_base = os.path.splitext(os.path.basename(image1_path))[0]
    image2_base = os.path.splitext(os.path.basename(image2_path))[0]

    # Create a unique folder for this case study using both image names and current timestamp
    suffix = datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_name = f"{parent_dir}/case_study_{image1_base}_vs_{image2_base}_{suffix}"
    os.makedirs(folder_name, exist_ok=True)

    # Save both images and the JSON file in the new folder
    copy2(image1_path, os.path.join(folder_name, os.path.basename(image1_path)))
    copy2(image2_path, os.path.join(folder_name, os.path.basename(image2_path)))
    similarity_score_percentage = similarity_score * 100  # Convert to percentage
    with open(os.path.join(folder_name, "similarity_score.json"), 'w') as json_file:
        json.dump({"Match result":match_result,"Similarity Score": similarity_score, "Similarity Score Percentage": f"{similarity_score_percentage:.2f}%"}, json_file)

    return match_result, similarity_score, folder_name  # Return the match result, similarity score, and folder name

# Example usage
# image1_path = "./1992.png"
# image2_path = "./1992.png"
# match_result, similarity_score, folder_name = verify_signatures(image1_path, image2_path)
# print(match_result)
# print(f"Similarity Score: {similarity_score}")
# print(f"Data saved in folder: {folder_name}")
