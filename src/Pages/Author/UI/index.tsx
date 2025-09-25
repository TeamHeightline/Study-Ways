import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { authorPageStore } from "../Store/store";
import AuthorNotFound from "./author-not-found";
import { observer } from "mobx-react";
import Loading from "./loading";
import { AuthorPage } from "./author-page";

export const Author = observer(() => {
  const { id } = useParams();

  function handleSetAuthorID() {
    if (!id) {
      return;
    }
    authorPageStore.setAuthorID(id);
  }

  useEffect(() => {
    handleSetAuthorID();
  }, [id]);

  useEffect(() => {
    handleSetAuthorID();
  }, []);

  if (authorPageStore.is_loading) {
    return <Loading />;
  }

  if (!authorPageStore.is_loading && !authorPageStore.pageData) {
    return <AuthorNotFound />;
  }

  return <AuthorPage />;
});
