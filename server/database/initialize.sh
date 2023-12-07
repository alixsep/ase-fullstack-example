#! /bin/bash
sqlite3 $PWD/server/database/database.db <<EOF
-- Create database file
.database

-- Create verification table
CREATE TABLE Verification (
    id INTEGER PRIMARY KEY,
    isVerified INTEGER CHECK (isVerified IN (0, 1))
);

-- Add data into verification table
INSERT INTO Verification (id, isVerified) VALUES
    (1001, 0),
    (1002, 0),
    (1003, 1),
    (1004, 1),
    (1005, 0);

-- Show table
SELECT * FROM Verification;
EOF