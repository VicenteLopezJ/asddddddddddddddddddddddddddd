package hct.junior.vicente.repository;

import hct.junior.vicente.model.Cliente;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ClienteRepository extends ReactiveCrudRepository<Cliente, Long> {

    Mono<Cliente> findByDni(String dni);

    Flux<Cliente> findByEstado(String estado);

}
