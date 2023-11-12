@echo off
setlocal enabledelayedexpansion

rem Set the location of the Tesseract command
set "tesseract_cmd=C:\Program Files\Tesseract-OCR\tesseract.exe"

set "main_folder=D:\[03] Church\[01] Pope Shenouda III\[02] Book Translating Project"
set "outputs_folder=%main_folder%\outputs"

rem Create the "outputs" folder if it doesn't exist
if not exist "%outputs_folder%" mkdir "%outputs_folder%"

rem Loop through subfolders in the main folder's "images" subdirectory
for /d %%A in ("%main_folder%\images\*") do (
    set "subfolder_name=%%~nxA"
    
    rem Create a subfolder with the same name in the "outputs" folder
    set "output_subfolder=%outputs_folder%\!subfolder_name!"
    if not exist "!output_subfolder!" mkdir "!output_subfolder!"

    rem Set the output file for the current subfolder
    set "output_file=!output_subfolder!\!subfolder_name!.txt"

    rem Clear the output file if it already exists for the current subfolder
    if exist "!output_file!" del "!output_file!"

    echo Processing images in folder: !subfolder_name!

    rem Loop through all image files in the current subfolder
    for %%I in ("%%A\!subfolder_name!\*.png") do (
        echo Processing: %%~nxI

        rem Execute the Tesseract command and append the output to the output file
        "%tesseract_cmd%" "%%I" - -l eng >> "!output_file!"

        rem Add a distinct separator between each image output in the output file
        echo ----------- >> "!output_file!"
    )

    echo All images in folder !subfolder_name! processed. Output saved to "!output_file!"
)

pause
