package hct.junior.vicente.service.impl;

import org.springframework.stereotype.Service;

import hct.junior.vicente.model.Cliente;
import hct.junior.vicente.repository.ClienteRepository;
import hct.junior.vicente.service.ClienteService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public Flux<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    @Override
    public Flux<Cliente> findActivos() {
        return clienteRepository.findByEstado("ACTIVO");
    }

    @Override
    public Flux<Cliente> findEliminados() {
        return clienteRepository.findByEstado("INACTIVO");
    }

    @Override
    public Mono<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }

    @Override
    public Mono<Cliente> findByDni(String dni) {
        return clienteRepository.findByDni(dni);
    }

    @Override
    public Mono<Cliente> save(Cliente cliente) {
        cliente.setEstado("ACTIVO");
        return clienteRepository.save(cliente);
    }

    @Override
    public Mono<Cliente> update(Cliente cliente) {
        return clienteRepository.findById(cliente.getId())
                .flatMap(existing -> {
                    if (cliente.getEstado() == null) {
                        cliente.setEstado(existing.getEstado());
                    }
                    return clienteRepository.save(cliente);
                });
    }

    @Override
    public Mono<Cliente> deactivate(Long id) {
        return clienteRepository.findById(id)
                .flatMap(cliente -> {
                    cliente.setEstado("INACTIVO");
                    return clienteRepository.save(cliente);
                });
    }

    @Override
    public Mono<Cliente> activate(Long id) {
        return clienteRepository.findById(id)
                .flatMap(cliente -> {
                    cliente.setEstado("ACTIVO");
                    return clienteRepository.save(cliente);
                });
    }

}
