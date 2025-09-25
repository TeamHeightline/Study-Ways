import { useAuth0 } from "@auth0/auth0-react";
import { ClientStorage } from "./Shared/Store/ApolloStorage/ClientStorage";
import axiosClient from "./Shared/ServerLayer/QueryLayer/config";
import { useEffect } from "react";
import { UserStorage } from "./Shared/Store/UserStore/UserStore";

export default function AppHook() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Функция для обновления токена
  const updateToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "sw-backend-identifier",
        scope: "read:current_user",
      });
      // Сохраните обновленный токен в клиентском хранилище
      ClientStorage.changeToken(token);
      // Обновите заголовки запросов для axios
      updateAxiosHeaders(token);
    } catch (error) {
      console.error("Ошибка обновления токена: ", error);
      // Обработка ошибок, например, выход пользователя из системы
    }
  };

  // Обновление заголовков axios
  const updateAxiosHeaders = (token) => {
    axiosClient.interceptors.request.use((config: any) => {
      config.headers.common["authorization"] = `Bearer ${token}`;
      config.headers.post["authorization"] = `Bearer ${token}`;
      return config;
    });

    UserStorage.reloadUser();
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Вызовите updateToken при монтировании компонента
      updateToken();
      // Интервал для регулярного обновления токена
      // const intervalId = setInterval(updateToken, 1000 * 60 * 15); // каждые 15 минут

      // return () => clearInterval(intervalId); // Очистка при размонтировании
    }
  }, [isAuthenticated]);

  return { isLoading };
}
