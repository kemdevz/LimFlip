import os
from PIL import Image
import matplotlib.pyplot as plt

def display_images_in_folder(folder_path):
    # Get all image files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif'))]
    
    # Set up the plot grid
    num_images = len(image_files)
    cols = 4  # Number of images per row
    rows = (num_images // cols) + (num_images % cols > 0)
    
    fig, axes = plt.subplots(rows, cols, figsize=(15, 5 * rows))
    axes = axes.flatten() if num_images > 1 else [axes]
    
    for ax, image_file in zip(axes, image_files):
        img_path = os.path.join(folder_path, image_file)
        img = Image.open(img_path)
        ax.imshow(img)
        ax.set_title(image_file)
        ax.axis("off")
    
    # Hide unused axes
    for ax in axes[len(image_files):]:
        ax.axis("off")
    
    plt.tight_layout()
    plt.show()

# Example usage
folder_path = "./processed_images"  # Replace with your folder path
display_images_in_folder(folder_path)
