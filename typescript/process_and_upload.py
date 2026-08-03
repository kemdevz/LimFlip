from PIL import Image
import os
import requests
import logging
import numpy as np
# Bunny.net Config
BUNNY_STORAGE_ZONE = "mm2-item-images"
BUNNY_PULL_ZONE_URL = "https://mm2-item-images.b-cdn.net/"
BUNNY_STORAGE_API_URL = f"https://storage.bunnycdn.com/{BUNNY_STORAGE_ZONE}/"
BUNNY_STORAGE_API_KEY = "d444b7f5-7fad-456a-99f0eeb6668d-21b8-420e"

IMAGE_FOLDER = "./images"
PROCESSED_FOLDER = "./processed_images"
LOG_FILE = "./manual-image.log"
FINAL_FOLDER = "./final_images"

if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)

logging.basicConfig(filename=LOG_FILE, level=logging.INFO)

# **NEW** Function to check if a pixel is close to `#1b1b1b` (±10 tolerance)
def is_near_black(color, tolerance=0):
    return all(abs(color[i] - 27) <= tolerance for i in range(3))

# **UPDATED** Function to remove dark background without removing details
def remove_background(image_path, background_image_path, output_path):
    # Load the image to process
    
    image = Image.open(image_path).convert("RGBA")
    data = np.array(image)

    # Load the background image to detect its dominant color
    background_image = Image.open(background_image_path).convert("RGB")
    background_color = np.array(background_image).mean(axis=(0, 1)).astype(int)

    # Identify areas matching the background color
    r, g, b, a = data.T
    background_areas = (r == background_color[0]) & (g == background_color[1]) & (b == background_color[2])

    # Set matching areas to transparent
    data[..., :-1][background_areas.T] = (0, 0, 0)  # Set RGB to black
    data[..., -1][background_areas.T] = 0  # Set alpha to 0

    # Convert back to an image with updated transparency
    transparent_image = Image.fromarray(data)

    # Save the updated image
    transparent_image.save(output_path, "PNG")
    print(f"✅ Processed {output_path}")


def check_bunny_image_exists(filename):
    response = requests.head(f"{BUNNY_PULL_ZONE_URL}{filename}")
    return response.status_code == 200

# ✅ Function to delete an existing image from Bunny.net
def delete_bunny_image(filename):
    headers = {
        "AccessKey": BUNNY_STORAGE_API_KEY
    }
    response = requests.delete(f"{BUNNY_STORAGE_API_URL}{filename}", headers=headers)

    if response.status_code == 200:
        print(f"🗑️ Deleted existing {filename} from Bunny.net")
        return True
    else:
        print(f"❌ Failed to delete {filename}, Status: {response.status_code}")
        return False

# ✅ Function to upload image to Bunny.net
def upload_to_bunny(image_path, filename):
    if check_bunny_image_exists(filename):
        delete_bunny_image(filename)  # Delete existing image before uploading

    with open(image_path, "rb") as image_file:
        headers = {
            "AccessKey": BUNNY_STORAGE_API_KEY,
            "Content-Type": "image/png",
        }
        response = requests.put(
            f"{BUNNY_STORAGE_API_URL}{filename}", headers=headers, data=image_file
        )

    if response.status_code == 201:
        print(f"✅ Uploaded {filename} to Bunny.net")
        return f"{BUNNY_PULL_ZONE_URL}{filename}"
    else:
        print(f"❌ Failed to upload {filename}, Status: {response.status_code}")
        return None
def remove_excess_background(image_path, output_path):
    image = Image.open(image_path).convert("RGBA")
    image_data = np.array(image)
    corner_pixels = np.concatenate([
        image_data[0, 0],  # Top-left corner
        image_data[0, -1],  # Top-right corner
        image_data[-1, 0],  # Bottom-left corner
        image_data[-1, -1]  # Bottom-right corner
    ]).reshape(4, -1)
    background_color = np.mean(corner_pixels, axis=0).astype(int)

    # Replace the background color with transparency
    r, g, b, a = image_data.T
    background_areas = (
        (r == background_color[0]) &
        (g == background_color[1]) &
        (b == background_color[2])
    )
    image_data[..., :-1][background_areas.T] = (0, 0, 0)  # Set RGB to black
    image_data[..., -1][background_areas.T] = 0  # Set alpha to 0

    # Convert back to an image
    transparent_image = Image.fromarray(image_data)
    transparent_image.save(output_path, "PNG")
    print(f"✅ Excess background removed for {output_path}")
# Process and upload all images
def process_and_upload():
    for filename in os.listdir(IMAGE_FOLDER):
        if filename.endswith(".png"):
            input_path = os.path.join(IMAGE_FOLDER, filename)
            output_path = os.path.join(PROCESSED_FOLDER, filename)
            final_path = os.path.join(FINAL_FOLDER, filename)

            # Remove background and save
            remove_background(input_path,"./bg-screen.png", output_path)
            remove_excess_background(output_path, final_path)
            # Upload to Bunny.net
            upload_to_bunny(output_path, final_path)

if __name__ == "__main__":
    process_and_upload()
    print("✅ Finished processing and uploading images.")
