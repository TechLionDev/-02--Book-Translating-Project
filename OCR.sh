#!/bin/bash

# Set the location of the Tesseract command
tesseract_cmd="/usr/bin/tesseract"

main_folder="/path/to/[03] Church/[01] Pope Shenouda III/[02] Book Translating Project"
outputs_folder="$main_folder/outputs"

# Create the "outputs" folder if it doesn't exist
if [ ! -d "$outputs_folder" ]; then
    mkdir -p "$outputs_folder"
fi

# Loop through subfolders in the main folder's "images" subdirectory
for subfolder in "$main_folder/images/"*; do
    subfolder_name=$(basename "$subfolder")

    # Create a subfolder with the same name in the "outputs" folder
    output_subfolder="$outputs_folder/$subfolder_name"
    if [ ! -d "$output_subfolder" ]; then
        mkdir -p "$output_subfolder"
    fi

    # Set the output file for the current subfolder
    output_file="$output_subfolder/$subfolder_name.txt"

    # Clear the output file if it already exists for the current subfolder
    if [ -e "$output_file" ]; then
        rm "$output_file"
    fi

    echo "Processing images in folder: $subfolder_name"

    # Loop through all image files in the current subfolder
    for image in "$subfolder/$subfolder_name"/*.png; do
        echo "Processing: $(basename "$image")"

        # Execute the Tesseract command and append the output to the output file
        $tesseract_cmd "$image" - -l eng >> "$output_file"

        # Add a distinct separator between each image output in the output file
        echo "-----------" >> "$output_file"
    done

    echo "All images in folder $subfolder_name processed. Output saved to $output_file"
done

read -p "Press Enter to exit"
