package hct.junior.vicente.service;

import hct.junior.vicente.model.Alquiler;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AlquilerService {
    Flux<Alquiler> findAll();
    Flux<Alquiler> findActivos();
    Flux<Alquiler> findCancelados();
    Mono<Alquiler> findById(Long id);
    Flux<Alquiler> findByClienteId(Long clienteId);
    Flux<Alquiler> findByVehiculoId(Long vehiculoId);
    Flux<Alquiler> findByEstado(String estado);
    Mono<Alquiler> save(Alquiler alquiler);
    Mono<Alquiler> update(Long id, Alquiler alquiler);
    Mono<Alquiler> cancel(Long id);
    Mono<Alquiler> restore(Long id);
}
