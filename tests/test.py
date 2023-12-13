from datetime import datetime, timedelta

# Function to calculate start and end dates based on the number of months ago
def calculate_start_end_dates(months_ago):
	today = datetime.now()
	end_date = today - timedelta(days=months_ago * 30)
	start_date = end_date - timedelta(days=30)
	return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")

# Example usage
def example_usage():
	for i in range(3, -1, -1):
		start_date, end_date = calculate_start_end_dates(i)
		print(f"Start Date: {start_date}, End Date: {end_date}")

# Call the example usage function
example_usage()