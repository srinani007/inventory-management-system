package com.synexiai.user;

import com.synexiai.user.dto.UserDto;

import java.util.Set;

public class LombokTest {
    public static void main(String[] args) {
        UserDto dto = UserDto.builder()
            .username("test")
            .roles(Set.of("ROLE_USER"))
            .build();
        System.out.println(dto.getUsername());
    }
}