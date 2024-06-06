#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' ../.env | xargs)

# Path to the SQL file
SQL_FILE="./scripts/hub.dml.sql"

# Command to load the SQL file into the database
psql -h localhost -U $DB_USER -d $DB_NAME -f $SQL_FILE

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo "Data loaded successfully."
else
  echo "Failed to load data."
fi
