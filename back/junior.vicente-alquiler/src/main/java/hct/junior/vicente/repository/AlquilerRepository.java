package hct.junior.vicente.repository;

import hct.junior.vicente.model.Alquiler;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface AlquilerRepository extends R2dbcRepository<Alquiler, Long> {

    Flux<Alquiler> findByClienteId(Long clienteId);

    Flux<Alquiler> findByVehiculoId(Long vehiculoId);

    Flux<Alquiler> findByEstado(String estado);

    // Permite buscar por múltiples valores de estado
    Flux<Alquiler> findByEstadoIn(List<String> estados);

}
