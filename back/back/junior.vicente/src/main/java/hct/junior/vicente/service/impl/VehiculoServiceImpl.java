package hct.junior.vicente.service.impl;

import org.springframework.stereotype.Service;

import hct.junior.vicente.model.Vehiculo;
import hct.junior.vicente.repository.VehiculoRepository;
import hct.junior.vicente.service.VehiculoService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class VehiculoServiceImpl implements VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoServiceImpl(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @Override
    public Flux<Vehiculo> findAll() {
        return vehiculoRepository.findAll();
    }

    @Override
    public Mono<Vehiculo> findById(Long id) {
        return vehiculoRepository.findById(id);
    }

    @Override
    public Mono<Vehiculo> save(Vehiculo vehiculo) {
        vehiculo.setEstado(true);
        return vehiculoRepository.save(vehiculo);
    }

    @Override
    public Mono<Vehiculo> update(Vehiculo vehiculo) {
        return vehiculoRepository.findById(vehiculo.getId())
                .flatMap(existing -> {
                    if (vehiculo.getEstado() == null) {
                        vehiculo.setEstado(existing.getEstado());
                    }
                    return vehiculoRepository.save(vehiculo);
                });
    }

    @Override
    public Mono<Vehiculo> deactivate(Long id) {
        return vehiculoRepository.findById(id)
                .flatMap(vehiculo -> {
                    vehiculo.setEstado(false);
                    return vehiculoRepository.save(vehiculo);
                });
    }

    @Override
    public Mono<Vehiculo> activate(Long id) {
        return vehiculoRepository.findById(id)
                .flatMap(vehiculo -> {
                    vehiculo.setEstado(true);
                    return vehiculoRepository.save(vehiculo);
                });
    }


}
