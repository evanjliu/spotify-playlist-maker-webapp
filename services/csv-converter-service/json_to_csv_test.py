import pandas as pd
import time
import json
from pathlib import Path

# Define relative path for the file to watch
watch_file = Path(r"SWE-CS361-PlaylistMaker\CSV-conversion-pipe.txt").resolve()

# Directory to save the CSV file
output_dir = Path(r"SWE-CS361-PlaylistMaker\downloads").resolve()
if not output_dir.exists():
    output_dir.mkdir(parents=True, exist_ok=True)

print(f"Service is ready to receive requests at {watch_file}\n")

while True:
    try:
        if watch_file.exists():
            with watch_file.open('r', encoding='utf-8') as file:
                content = file.read().strip()

                if content and 'convert' in content:
                    data = json.loads(content)

                    if data[0] == "convert":
                        # Check if data[1] is a dictionary and convert it to a list of dictionaries if needed
                        if isinstance(data[1], dict):
                            songs = [v for k, v in sorted(data[1].items())]
                        else:
                            songs = list(data[1])
                        
                        df = pd.DataFrame(songs)
                        output_path = output_dir / "My_Playlist.csv"
                        df.to_csv(output_path, index=False, encoding='utf-8')

                        with watch_file.open('w', encoding='utf-8') as f:
                            json.dump({"csv_path": str(output_path)}, f)

                        print("Data converted to CSV file!\nReady to receive more requests!\n")
        else:
            print(f"File {watch_file} does not exist. Waiting for it to be created.")
    except Exception as e:
        print("An error occurred:", e)

    time.sleep(5)
