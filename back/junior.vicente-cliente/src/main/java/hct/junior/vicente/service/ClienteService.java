package hct.junior.vicente.service;

import hct.junior.vicente.model.Cliente;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ClienteService {
    Flux<Cliente> findAll();
    Flux<Cliente> findActivos();
    Flux<Cliente> findEliminados();
    Mono<Cliente> findById(Long id);
    Mono<Cliente> findByDni(String dni);
    Mono<Cliente> save(Cliente cliente);
    Mono<Cliente> update(Cliente cliente);
    Mono<Cliente> deactivate(Long id);
    Mono<Cliente> activate(Long id);
}
