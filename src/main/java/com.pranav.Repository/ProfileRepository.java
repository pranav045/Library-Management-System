package com.pranav.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranav.Entity.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {

}
