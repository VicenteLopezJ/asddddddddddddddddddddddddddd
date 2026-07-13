package hct.junior.vicente.service.impl;

import org.springframework.stereotype.Service;

import hct.junior.vicente.model.Alquiler;
import hct.junior.vicente.repository.AlquilerRepository;
import hct.junior.vicente.service.AlquilerService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class AlquilerServiceImpl implements AlquilerService {

    private final AlquilerRepository alquilerRepository;

    public AlquilerServiceImpl(AlquilerRepository alquilerRepository) {
        this.alquilerRepository = alquilerRepository;
    }

    @Override
    public Flux<Alquiler> findAll() {
        return alquilerRepository.findAll();
    }

    @Override
    public Flux<Alquiler> findActivos() {
        // Acepta 'ACTIVO' y también 'PENDIENTE' por compatibilidad
        return alquilerRepository.findByEstadoIn(List.of("ACTIVO", "PENDIENTE"));
    }

    @Override
    public Flux<Alquiler> findCancelados() {
        // Acepta 'CANCELADO' e 'INACTIVO' por compatibilidad con datos existentes
        return alquilerRepository.findByEstadoIn(List.of("CANCELADO", "INACTIVO"));
    }

    @Override
    public Mono<Alquiler> findById(Long id) {
        return alquilerRepository.findById(id);
    }

    @Override
    public Flux<Alquiler> findByClienteId(Long clienteId) {
        return alquilerRepository.findByClienteId(clienteId);
    }

    @Override
    public Flux<Alquiler> findByVehiculoId(Long vehiculoId) {
        return alquilerRepository.findByVehiculoId(vehiculoId);
    }

    @Override
    public Flux<Alquiler> findByEstado(String estado) {
        return alquilerRepository.findByEstado(estado);
    }

    @Override
    public Mono<Alquiler> save(Alquiler alquiler) {
        alquiler.setEstado("ACTIVO");
        return alquilerRepository.save(alquiler);
    }

    @Override
    public Mono<Alquiler> update(Long id, Alquiler alquiler) {
        return alquilerRepository.findById(id)
                .flatMap(existing -> {
                    alquiler.setId(id);
                    if (alquiler.getEstado() == null) {
                        alquiler.setEstado(existing.getEstado());
                    }
                    return alquilerRepository.save(alquiler);
                });
    }

    @Override
    public Mono<Alquiler> cancel(Long id) {
        return alquilerRepository.findById(id)
                .flatMap(alquiler -> {
                    alquiler.setEstado("CANCELADO");
                    return alquilerRepository.save(alquiler);
                });
    }

    @Override
    public Mono<Alquiler> restore(Long id) {
        return alquilerRepository.findById(id)
                .flatMap(alquiler -> {
                    alquiler.setEstado("ACTIVO");
                    return alquilerRepository.save(alquiler);
                });
    }

}
