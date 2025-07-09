package com.synexiai.user.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_WAREHOUSE_STAFF,
  ROLE_USER;

  @Override
  public String getAuthority() {
    return name();
  }
}