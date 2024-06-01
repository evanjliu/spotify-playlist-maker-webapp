import pandas as pd
import time
import json
import os

# File path for the file to watch
watch_file = "../SWE-CS361-PlaylistMaker/CSV-conversion-pipe.txt"

# Directory to save the CSV file
output_dir = "../SWE-CS361-PlaylistMaker/downloads"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print("Service is ready to receive requests at", watch_file, "\n")

while True:
    try:
        with open(watch_file, 'r', encoding='utf-8') as file:
            content = file.read().strip()

            if content and 'convert' in content:
                data = json.loads(content)

                if data[0] == "convert":
                    songs = list(data[1])
                    df = pd.DataFrame(songs)
                    output_path = os.path.abspath(os.path.join(output_dir, "My_Playlist.csv"))
                    df.to_csv(output_path, index=False, encoding='utf-8')

                    with open(watch_file, 'w', encoding='utf-8') as f:
                        json.dump({"csv_path": output_path}, f)

                    print("Data converted to CSV file!\nReady to receive more requests!\n")

    except Exception as e:
        print("An error occurred:", e)

    time.sleep(5)
