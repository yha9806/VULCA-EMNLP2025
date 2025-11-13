#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Upscale artwork-14 images from ~215x173px to 1200x960px
Uses high-quality Lanczos resampling for best results
"""

from PIL import Image
import os
import shutil

def upscale_images(input_dir, backup_dir, target_width=1200, target_height=960):
    """
    Upscale all images in input_dir to target dimensions

    Args:
        input_dir: Directory containing images to upscale
        backup_dir: Directory to store original images
        target_width: Target width in pixels
        target_height: Target height in pixels
    """

    # Create backup directory
    os.makedirs(backup_dir, exist_ok=True)

    print(f"Upscaling images in: {input_dir}")
    print(f"Target size: {target_width}x{target_height}px")
    print(f"Backup location: {backup_dir}\n")

    files = sorted([f for f in os.listdir(input_dir) if f.endswith('.png')])

    for filename in files:
        input_path = os.path.join(input_dir, filename)
        backup_path = os.path.join(backup_dir, filename)

        try:
            # Backup original
            shutil.copy2(input_path, backup_path)
            print(f"[BACKUP] {filename} -> {backup_path}")

            # Open and upscale
            img = Image.open(input_path)
            original_size = img.size
            print(f"[RESIZE] {filename}: {original_size[0]}x{original_size[1]}px -> {target_width}x{target_height}px")

            # Use LANCZOS for high-quality upscaling
            img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

            # Save with high quality
            img_resized.save(input_path, 'PNG', optimize=True)

            # Verify new size
            img_verify = Image.open(input_path)
            new_size = img_verify.size
            print(f"[OK] {filename}: Upscaled to {new_size[0]}x{new_size[1]}px\n")

        except Exception as e:
            print(f"[ERROR] Failed to process {filename}: {e}\n")
            # Restore from backup if failed
            if os.path.exists(backup_path):
                shutil.copy2(backup_path, input_path)
                print(f"[RESTORE] Restored original {filename}\n")

def main():
    artwork_dir = r"I:\VULCA-EMNLP2025\assets\artworks\artwork-14"
    backup_dir = r"I:\VULCA-EMNLP2025\assets\artworks\artwork-14\.originals"

    print("="*60)
    print("Upscale artwork-14 Images")
    print("="*60)
    print()

    # Calculate aspect ratio from first image
    first_image = os.path.join(artwork_dir, "01.png")
    img = Image.open(first_image)
    original_ratio = img.width / img.height
    print(f"Original aspect ratio: {original_ratio:.2f}")

    # Target dimensions maintaining aspect ratio
    target_width = 1200
    target_height = int(target_width / original_ratio)

    upscale_images(artwork_dir, backup_dir, target_width, target_height)

    print("="*60)
    print("Upscaling complete!")
    print(f"Originals backed up to: {backup_dir}")
    print("="*60)

if __name__ == "__main__":
    main()
