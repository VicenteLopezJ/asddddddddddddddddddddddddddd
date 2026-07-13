package hct.junior.vicente.repository;

import hct.junior.vicente.model.Vehiculo;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface VehiculoRepository extends ReactiveCrudRepository<Vehiculo, Long> {

    Flux<Vehiculo> findByEstado(String estado);

}
