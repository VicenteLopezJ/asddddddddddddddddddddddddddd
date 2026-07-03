package hct.junior.vicente.service;

import hct.junior.vicente.model.Vehiculo;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface VehiculoService {
    Flux<Vehiculo> findAll();
    Mono<Vehiculo> findById(Long id);
    Mono<Vehiculo> save(Vehiculo vehiculo);
    Mono<Vehiculo> update(Vehiculo vehiculo);
    Mono<Vehiculo> deactivate(Long id);
    Mono<Vehiculo> activate(Long id);

    
}
