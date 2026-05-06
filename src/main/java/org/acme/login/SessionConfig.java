package org.acme.login;

import io.quarkus.runtime.StartupEvent;
import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

@ApplicationScoped
public class SessionConfig {

    @Inject
    Vertx vertx;

    public void init(@Observes StartupEvent event, Router router) {
        router.route().handler(
                SessionHandler.create(LocalSessionStore.create(vertx))
                        .setSessionTimeout(60 * 60 * 1000)
                        .setCookieHttpOnlyFlag(true)
        );
    }
}