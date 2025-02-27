/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package org.apache.streampipes.client.credentials;

import org.apache.http.Header;
import org.apache.streampipes.client.http.header.Headers;
import org.apache.streampipes.security.jwt.JwtTokenUtils;

import java.util.Collections;
import java.util.Date;
import java.util.List;

public class StreamPipesTokenCredentials implements CredentialsProvider {

  private static final long TokenExpirationTime = 600000;

  private final String username;
  private final String tokenSecret;

  public StreamPipesTokenCredentials(String username, String tokenSecret) {
    this.username = username;
    this.tokenSecret = tokenSecret;
  }

  public String getUsername() {
    return username;
  }

  public String getTokenSecret() {
    return tokenSecret;
  }

  private String makeJwtToken() {
    return JwtTokenUtils.makeJwtToken(username, tokenSecret, makeExpirationDate());
  }

  private Date makeExpirationDate() {
    Date now = new Date();
    return new Date(now.getTime() + TokenExpirationTime);
  }

  @Override
  public List<Header> makeHeaders() {
    String jwtToken = makeJwtToken();
    return Collections.singletonList(Headers.authorizationBearer(jwtToken));
  }
}
