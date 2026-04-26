package com.pranav.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Profile;
import com.pranav.Repository.ProfileRepository;

@Repository
public class ProfileDAO {
	@Autowired
	private ProfileRepository profileRepository;

	public Profile saveProfile(Profile profile) {
		return profileRepository.save(profile);
	}

	public Profile getProfile(int id) {
		return profileRepository.findById(id).orElse(null);
	}

	public boolean deleteAProfile(int id) {
		if (profileRepository.existsById(id)) {
			profileRepository.deleteById(id);
			return true;
		} else {
			return false;
		}
	}
}
