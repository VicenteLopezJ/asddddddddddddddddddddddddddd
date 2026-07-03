package hct.junior.vicente.repository;
import hct.junior.vicente.model.Vehiculo;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;


public interface VehiculoRepository extends ReactiveCrudRepository<Vehiculo, Long> {
    
}
