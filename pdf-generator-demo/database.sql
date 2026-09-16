-- Create a table to hold the analyzed report data
CREATE TABLE report_metrics (
    id SERIAL PRIMARY KEY,
    feature_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT
);

-- Insert some sample analyzed data
INSERT INTO report_metrics (feature_name, status, rating, notes) VALUES 
('Dynamic PDF Generation', 'Completed', 5, 'Rendering perfectly in browser'),
('Custom Letterhead', 'Completed', 5, 'Logo aligned to top right'),
('Data Analysis Engine', 'In Progress', 3, 'Processing large sets slowly'),
('User Authentication', 'Pending', 0, 'Awaiting security review');
