package com.pranav.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Enables refreshing / deep-linking for the Vite-built SPA when served by Spring Boot.
 * Any non-file GET route that isn't matched by a backend controller will be forwarded to index.html.
 */
@Controller
public class SpaForwardController {

	@GetMapping(value = { "/{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
	public String forwardSpaRoutes() {
		return "forward:/index.html";
	}
}

