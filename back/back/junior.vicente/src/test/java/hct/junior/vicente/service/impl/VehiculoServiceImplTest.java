package hct.junior.vicente.service.impl;

import hct.junior.vicente.model.Vehiculo;
import hct.junior.vicente.repository.VehiculoRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class VehiculoServiceImplTest {

    @Test
    void updateShouldPreserveExistingEstadoWhenNotProvided() {
        VehiculoRepository repository = Mockito.mock(VehiculoRepository.class);
        VehiculoServiceImpl service = new VehiculoServiceImpl(repository);

        Vehiculo existing = new Vehiculo(1L, "ABC123", "Toyota", "Corolla", 2020, "Rojo", 50.0, true);
        Vehiculo incoming = new Vehiculo(1L, "ABC21", "Toyoaaaata", "Corolla", 2025, "Rojo", 60.0, null);

        when(repository.findById(1L)).thenReturn(Mono.just(existing));
        when(repository.save(any(Vehiculo.class))).thenAnswer(invocation -> Mono.just(invocation.getArgument(0)));

        StepVerifier.create(service.update(incoming))
                .assertNext(updated -> {
                    assertThat(updated.getEstado()).isTrue();
                    assertThat(updated.getPlaca()).isEqualTo("ABC21");
                    assertThat(updated.getPrecioPorDia()).isEqualTo(60.0);
                })
                .verifyComplete();
    }
}
