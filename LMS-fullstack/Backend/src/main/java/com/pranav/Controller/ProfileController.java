package com.pranav.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Profile;
import com.pranav.Service.ProfileService;

@RestController("lmsProfileController")
@CrossOrigin(origins = "*")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @PostMapping("/saveProfile")
    public ResponseEntity<ResponseStructure<Profile>> saveProfile(@RequestBody Profile profile) {
        return profileService.saveProfile(profile);
    }

    @GetMapping("/getProfile/{id}")
    public ResponseEntity<ResponseStructure<Profile>> getProfile(@PathVariable int id) {
        return profileService.getProfile(id);
    }

    @GetMapping("/getAllProfiles")
    public ResponseEntity<ResponseStructure<List<Profile>>> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @DeleteMapping("/deleteProfile/{id}")
    public ResponseEntity<ResponseStructure<Profile>> deleteProfile(@PathVariable int id) {
        return profileService.deleteProfile(id);
    }
}
