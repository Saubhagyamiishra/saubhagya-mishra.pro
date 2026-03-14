#!/usr/bin/env python3
"""
Backend API Test Suite for Contact Form Integration
Tests all contact form endpoints and validation scenarios.
"""

import requests
import json
import os
import sys
from datetime import datetime

# Get backend URL from frontend .env file (production URL)
BACKEND_URL = "https://saubhagya-nexus.preview.emergentagent.com/api"

class ContactFormTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "failures": []
        }
        self.submission_ids = []  # Store submission IDs for cleanup
        
    def log_test(self, test_name, passed, error=None):
        """Log test results"""
        if passed:
            self.test_results["passed"] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results["failed"] += 1
            self.test_results["failures"].append(f"{test_name}: {error}")
            print(f"❌ {test_name}: {error}")
    
    def test_valid_contact_submission(self):
        """Test POST /api/contact with valid data"""
        test_name = "Valid Contact Submission"
        
        payload = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "message": "This is a test message for the contact form integration testing."
        }
        
        try:
            response = requests.post(f"{self.backend_url}/contact", 
                                   json=payload, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                if (data.get("success") is True and 
                    "submission_id" in data and 
                    "message" in data and
                    "Thank you for reaching out!" in data["message"]):
                    
                    self.submission_ids.append(data["submission_id"])
                    self.log_test(test_name, True)
                    return True
                else:
                    self.log_test(test_name, False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
            return False
    
    def test_missing_name_validation(self):
        """Test validation with missing name"""
        test_name = "Missing Name Validation"
        
        payload = {
            "email": "test@example.com",
            "message": "Test message without name"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/contact", 
                                   json=payload, 
                                   timeout=10)
            
            # Should return 422 for validation error
            if response.status_code == 422:
                self.log_test(test_name, True)
                return True
            else:
                self.log_test(test_name, False, f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
            return False
    
    def test_invalid_email_validation(self):
        """Test validation with invalid email format"""
        test_name = "Invalid Email Validation"
        
        payload = {
            "name": "Test User",
            "email": "invalid-email-format",
            "message": "Test message with invalid email"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/contact", 
                                   json=payload, 
                                   timeout=10)
            
            # Should return 422 for validation error
            if response.status_code == 422:
                self.log_test(test_name, True)
                return True
            else:
                self.log_test(test_name, False, f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
            return False
    
    def test_empty_message_validation(self):
        """Test validation with empty message"""
        test_name = "Empty Message Validation"
        
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "message": ""
        }
        
        try:
            response = requests.post(f"{self.backend_url}/contact", 
                                   json=payload, 
                                   timeout=10)
            
            # Should return 422 for validation error
            if response.status_code == 422:
                self.log_test(test_name, True)
                return True
            else:
                self.log_test(test_name, False, f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
            return False
    
    def test_get_submissions_endpoint(self):
        """Test GET /api/contact/submissions endpoint"""
        test_name = "Get Contact Submissions"
        
        try:
            response = requests.get(f"{self.backend_url}/contact/submissions", 
                                  timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                if (data.get("success") is True and 
                    "count" in data and 
                    "submissions" in data and
                    isinstance(data["submissions"], list)):
                    
                    self.log_test(test_name, True)
                    return True, data["submissions"]
                else:
                    self.log_test(test_name, False, f"Invalid response structure: {data}")
                    return False, None
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return False, None
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
            return False, None
    
    def test_database_storage_verification(self, submissions):
        """Verify that submissions are properly stored in database"""
        test_name = "Database Storage Verification"
        
        if not submissions:
            self.log_test(test_name, False, "No submissions to verify")
            return False
        
        # Look for our test submission
        test_submission = None
        for submission in submissions:
            if submission.get("name") == "John Doe" and submission.get("email") == "john.doe@example.com":
                test_submission = submission
                break
        
        if not test_submission:
            self.log_test(test_name, False, "Test submission not found in database")
            return False
        
        # Verify required fields are present
        required_fields = ["name", "email", "message", "submitted_at", "status"]
        missing_fields = [field for field in required_fields if field not in test_submission]
        
        if missing_fields:
            self.log_test(test_name, False, f"Missing fields: {missing_fields}")
            return False
        
        # Verify field values
        if (test_submission["name"] == "John Doe" and
            test_submission["email"] == "john.doe@example.com" and
            "test message" in test_submission["message"].lower() and
            test_submission["status"] == "new"):
            
            self.log_test(test_name, True)
            return True
        else:
            self.log_test(test_name, False, "Field values don't match expected values")
            return False
    
    def test_server_health(self):
        """Test if the backend server is running and responsive"""
        test_name = "Backend Server Health"
        
        try:
            # Test the root endpoint
            response = requests.get(f"{self.backend_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_test(test_name, True)
                    return True
                else:
                    self.log_test(test_name, False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all contact form tests"""
        print("=" * 60)
        print("CONTACT FORM BACKEND INTEGRATION TESTS")
        print(f"Backend URL: {self.backend_url}")
        print("=" * 60)
        
        # Test server health first
        if not self.test_server_health():
            print("\n❌ Backend server is not responding. Skipping further tests.")
            return self.get_results()
        
        # Test valid submission first
        self.test_valid_contact_submission()
        
        # Test validation scenarios
        self.test_missing_name_validation()
        self.test_invalid_email_validation()
        self.test_empty_message_validation()
        
        # Test submissions endpoint and database storage
        success, submissions = self.test_get_submissions_endpoint()
        if success and submissions:
            self.test_database_storage_verification(submissions)
        
        return self.get_results()
    
    def get_results(self):
        """Return test results summary"""
        total_tests = self.test_results["passed"] + self.test_results["failed"]
        
        print("\n" + "=" * 60)
        print("TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {self.test_results['passed']}")
        print(f"Failed: {self.test_results['failed']}")
        
        if self.test_results["failures"]:
            print("\nFAILURES:")
            for failure in self.test_results["failures"]:
                print(f"  - {failure}")
        
        success_rate = (self.test_results["passed"] / total_tests * 100) if total_tests > 0 else 0
        print(f"\nSuccess Rate: {success_rate:.1f}%")
        
        return {
            "total_tests": total_tests,
            "passed": self.test_results["passed"],
            "failed": self.test_results["failed"],
            "success_rate": success_rate,
            "failures": self.test_results["failures"]
        }

def main():
    """Main test execution"""
    tester = ContactFormTester()
    results = tester.run_all_tests()
    
    # Exit with non-zero code if any tests failed
    sys.exit(0 if results["failed"] == 0 else 1)

if __name__ == "__main__":
    main()