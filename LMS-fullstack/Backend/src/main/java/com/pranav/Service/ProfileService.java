package com.pranav.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.pranav.DAO.ProfileDAO;
import com.pranav.DTO.ResponseStructure;
import com.pranav.Entity.Profile;
import com.pranav.Exception.EmptyException;
import com.pranav.Exception.IdDoesNotPresentException;

@Service
public class ProfileService {
    @Autowired
    private ProfileDAO profileDAO;

    public ResponseEntity<ResponseStructure<Profile>> saveProfile(Profile profile) {
        Profile data = profileDAO.saveProfile(profile);
        ResponseStructure<Profile> rs = new ResponseStructure<>();
        rs.setData(data);
        rs.setMessage("Profile Saved Successfully");
        rs.setStatusCode(HttpStatus.CREATED.value());
        return new ResponseEntity<>(rs, HttpStatus.CREATED);
    }

    public ResponseEntity<ResponseStructure<Profile>> getProfile(int id) {
        Profile data = profileDAO.findProfile(id);
        if (data != null) {
            ResponseStructure<Profile> rs = new ResponseStructure<>();
            rs.setData(data);
            rs.setMessage("Profile Found Successfully");
            rs.setStatusCode(HttpStatus.OK.value());
            return new ResponseEntity<>(rs, HttpStatus.OK);
        } else {
            throw new IdDoesNotPresentException("Profile with Id " + id + " does not exist!");
        }
    }

    public ResponseEntity<ResponseStructure<List<Profile>>> getAllProfiles() {
        List<Profile> data = profileDAO.findAllProfiles();
        if (data != null && !data.isEmpty()) {
            ResponseStructure<List<Profile>> rs = new ResponseStructure<>();
            rs.setData(data);
            rs.setMessage("Profiles found successfully");
            rs.setStatusCode(HttpStatus.OK.value());
            return new ResponseEntity<>(rs, HttpStatus.OK);
        } else {
            throw new EmptyException("No profiles found");
        }
    }

    public ResponseEntity<ResponseStructure<Profile>> deleteProfile(int id) {
        Profile data = profileDAO.findProfile(id);
        if (data != null) {
            profileDAO.deleteProfile(id);
            ResponseStructure<Profile> rs = new ResponseStructure<>();
            rs.setData(null);
            rs.setMessage("Profile with Id " + id + " deleted successfully");
            rs.setStatusCode(HttpStatus.OK.value());
            return new ResponseEntity<>(rs, HttpStatus.OK);
        } else {
            throw new IdDoesNotPresentException("Profile with Id " + id + " does not exist.");
        }
    }
}
