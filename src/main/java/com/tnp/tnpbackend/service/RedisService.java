package com.tnp.tnpbackend.service;

public interface RedisService {
    public <T> T get(String key, Class<T> entityClass);
    public void set(String key, Object o, Long ttl);
}
