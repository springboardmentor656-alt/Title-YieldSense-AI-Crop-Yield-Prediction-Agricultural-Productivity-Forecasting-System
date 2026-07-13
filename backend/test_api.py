import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api/v1"

def make_request(path, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    req_data = None
    if data:
        req_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            return response.status, json.loads(res_data) if res_data else {}
    except urllib.error.HTTPError as e:
        err_data = e.read().decode("utf-8")
        print(f"HTTPError: {e.code} on {method} {path} - {err_data}")
        return e.code, json.loads(err_data) if err_data else {}
    except Exception as e:
        print(f"Error on {method} {path}: {str(e)}")
        return 500, {"detail": str(e)}

def run_tests():
    print("=== STARTING BACKEND REST API END-TO-END TESTS ===")
    
    # 1. Health Check
    status, body = make_request("/health")
    assert status == 200, "Health check failed"
    print("[OK] Health Check Passed:", body)
    
    # 2. Register Farmer
    farmer_payload = {
        "email": "farmer_test@yieldsense.ai",
        "password": "password123",
        "role": "Farmer"
    }
    status, body = make_request("/register", "POST", farmer_payload)
    if status == 409:
        print("[INFO] Farmer already registered, proceeding to login...")
    else:
        assert status == 200, f"Register failed: {body}"
        assert "access_token" in body, "No token returned"
        print("[OK] Register Farmer Passed")
        
    # 3. Login Farmer
    status, body = make_request("/login", "POST", {
        "email": "farmer_test@yieldsense.ai",
        "password": "password123"
    })
    assert status == 200, f"Login failed: {body}"
    token = body["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Login Farmer Passed")
    
    # 4. Get current user
    status, body = make_request("/me", "GET", headers=headers)
    assert status == 200, "Fetch current user failed"
    print("[OK] Get Current User Passed:", body)
    
    # 5. Create Profile
    profile_payload = {
        "full_name": "John Doe",
        "phone": "+1234567890",
        "address": "Green Acres Farm Sector 5",
        "experience_years": 12
    }
    status, body = make_request("/profile", "POST", profile_payload, headers=headers)
    assert status == 200, f"Profile create failed: {body}"
    print("[OK] Create Profile Passed")
    
    # 6. Read Profile
    status, body = make_request("/profile", "GET", headers=headers)
    assert status == 200, "Fetch profile failed"
    assert body["full_name"] == "John Doe", "Name mismatch"
    print("[OK] Get Profile Passed:", body)
    
    # 7. Create Farm
    farm_payload = {
        "farm_name": "Golden Valley",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "farm_size": 25.4,
        "soil_type": "Loamy",
        "irrigation_type": "Sprinkler",
        "crops_grown": "Corn, Wheat"
    }
    status, body = make_request("/farms", "POST", farm_payload, headers=headers)
    assert status == 200, f"Create farm failed: {body}"
    farm_id = body["id"]
    print("[OK] Create Farm Passed, Farm ID:", farm_id)
    
    # 8. List Farms
    status, body = make_request("/farms", "GET", headers=headers)
    assert status == 200, "List farms failed"
    assert len(body) > 0, "No farms found"
    print(f"[OK] List Farms Passed. Count: {len(body)}")
    
    # 9. Create Crop Record
    crop_payload = {
        "farm_id": farm_id,
        "crop_name": "Corn",
        "season": "Kharif",
        "area_cultivated": 12.5,
        "production_amount": 45000,
        "rainfall": 820,
        "temperature": 24.5,
        "fertilizer_usage": 150,
        "previous_yield": 3600
    }
    status, body = make_request("/crops", "POST", crop_payload, headers=headers)
    assert status == 200, f"Create crop record failed: {body}"
    crop_id = body["id"]
    print("[OK] Create Crop Record Passed, Crop ID:", crop_id)
    
    # 10. List Crops
    status, body = make_request("/crops", "GET", headers=headers)
    assert status == 200, "List crops failed"
    assert len(body) > 0, "No crops found"
    print(f"[OK] List Crops Passed. Count: {len(body)}")
    
    # 11. Create Soil Record
    soil_payload = {
        "farm_id": farm_id,
        "ph_value": 6.5,
        "nitrogen": 48.0,
        "phosphorus": 32.0,
        "potassium": 29.5,
        "organic_matter": 2.8,
        "fertility_level": "Medium"
    }
    status, body = make_request("/soils", "POST", soil_payload, headers=headers)
    assert status == 200, f"Create soil failed: {body}"
    soil_id = body["id"]
    print("[OK] Create Soil Record Passed, Soil ID:", soil_id)
    
    # 12. List Soil Records
    status, body = make_request("/soils", "GET", headers=headers)
    assert status == 200, "List soils failed"
    print(f"[OK] List Soils Passed. Count: {len(body)}")
    
    # 13. Create Weather Record
    weather_payload = {
        "farm_id": farm_id,
        "rainfall": 12.4,
        "average_temperature": 28.0,
        "humidity": 65.5,
        "climate_condition": "Sunny"
    }
    status, body = make_request("/weather", "POST", weather_payload, headers=headers)
    assert status == 200, f"Create weather failed: {body}"
    weather_id = body["id"]
    print("[OK] Create Weather Record Passed, Weather ID:", weather_id)
    
    # 14. List Weather Records
    status, body = make_request("/weather", "GET", headers=headers)
    assert status == 200, "List weather failed"
    print(f"[OK] List Weather Passed. Count: {len(body)}")
    
    # 15. Create Historical Record
    hist_payload = {
        "farm_id": farm_id,
        "year": 2023,
        "crop_name": "Wheat",
        "yield_amount": 3500,
        "rainfall": 780,
        "temperature": 22.0,
        "notes": "Excellent seasonal rainfall yields"
    }
    status, body = make_request("/historical", "POST", hist_payload, headers=headers)
    assert status == 200, f"Create historical record failed: {body}"
    hist_id = body["id"]
    print("[OK] Create Historical Record Passed, ID:", hist_id)
    
    # 16. List Historical Records
    status, body = make_request("/historical", "GET", headers=headers)
    assert status == 200, "List historical failed"
    print(f"[OK] List Historical Passed. Count: {len(body)}")
    
    # 17. Register Admin
    admin_payload = {
        "email": "admin_test@yieldsense.ai",
        "password": "adminpassword123",
        "role": "Admin"
    }
    status, body = make_request("/register", "POST", admin_payload)
    if status == 409:
        print("[INFO] Admin already registered, logging in...")
    else:
        assert status == 200, f"Admin register failed: {body}"
        print("[OK] Register Admin Passed")
        
    # 18. Login Admin
    status, body = make_request("/login", "POST", {
        "email": "admin_test@yieldsense.ai",
        "password": "adminpassword123"
    })
    assert status == 200, "Admin login failed"
    admin_token = body["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("[OK] Login Admin Passed")
    
    # 19. Admin List Users
    status, body = make_request("/admin/users", "GET", headers=admin_headers)
    assert status == 200, f"Admin user listing failed: {body}"
    assert len(body) >= 2, "Should find at least farmer and admin"
    print("[OK] Admin List Users Passed. Registered accounts count:", len(body))
    
    print("\nALL BACKEND API END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()

