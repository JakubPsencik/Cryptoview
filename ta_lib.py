from datetime import datetime, timedelta

# Input strings
start_date_str = "2024-04-01T10:00"
end_date_str = "2024-04-15T13:54"

# Parse start date string
start_date_components = start_date_str.split("T")[0].split("-") + start_date_str.split("T")[1].split(":")
start_date = datetime(int(start_date_components[0]), int(start_date_components[1]), int(start_date_components[2]), int(start_date_components[3]), int(start_date_components[4]))

# Parse end date string
end_date_components = end_date_str.split("T")[0].split("-") + end_date_str.split("T")[1].split(":")
end_date = datetime(int(end_date_components[0]), int(end_date_components[1]), int(end_date_components[2]), int(end_date_components[3]), int(end_date_components[4]))

# Print the datetime objects
print("start_date =", start_date)
print("end_date =", end_date)

# Initialize an empty list to store formatted dates
formatted_dates = []

# Iterate from start date to end date, adding one day each time
current_date = start_date
while current_date <= end_date:
    # Format current date and time and append it to the list
    formatted_dates.append(current_date.strftime("%Y-%m-%d %H:%M:%S"))
    current_date += timedelta(days=1)  # Add one day to current date

# Print the list of formatted dates
print(formatted_dates)