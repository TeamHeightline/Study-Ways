import {
  CoursePageCard as Material,
  useCoursePageMaterials,
} from '../../course-materials-api';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Alert, Button, Skeleton } from '@mui/material';
import {
  AccountTreeOutlined,
  ArrowBackRounded,
  ArrowForwardRounded,
  CenterFocusStrongRounded,
  CollectionsBookmarkOutlined,
  LinkRounded,
  PlayCircleOutlineRounded,
  RemoveRounded,
  AddRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';
import { positionDataI } from '../../CourseMicroView/V2/Store/CourseMicroStoreByID';
import { cardIDs, normalizeCourseData } from '../../EditCourseByID/course-data';
import {
  MobileCourseNode,
  courseNodes,
  mobilePosition,
  mobileCourseUrl,
} from './mobile-course-data';
import { parseRutubeUrl } from '../../../../Shared/Video/rutube';
import urlParser from 'js-video-url-parser';
import './mobile-course.css';

const COLUMN = 152,
  ROW = 174,
  NODE_WIDTH = 124,
  NODE_HEIGHT = 116,
  TOP = 32,
  LEFT = 14;
const keyOf = (node: MobileCourseNode) =>
  `${node.row}:${node.page}:${node.index}`;
const counted = (count: number, forms: [string, string, string]) =>
  `${count} ${forms[count % 100 >= 11 && count % 100 <= 14 ? 2 : count % 10 === 1 ? 0 : count % 10 >= 2 && count % 10 <= 4 ? 1 : 2]}`;
function materialTitle(
  node: MobileCourseNode,
  materials: Record<string, Material>,
) {
  const ids = cardIDs(node.item.id);
  return node.item.type === 'course-link'
    ? 'Следующий курс'
    : ids.length > 1
      ? `Подборка · ${counted(ids.length, ['материал', 'материала', 'материалов'])}`
      : materials[ids[0]]?.title || `Материал №${ids[0]}`;
}
function MaterialCover({
  node,
  data,
}: {
  node: MobileCourseNode;
  data?: Material;
}) {
  const ids = cardIDs(node.item.id);
  const youtube =
    !parseRutubeUrl(data?.video_url || '') &&
    urlParser.parse(data?.video_url || '');
  const image =
    ids.length === 1 && node.item.type !== 'course-link'
      ? data?.card_content_type === 0
        ? youtube && youtube.provider === 'youtube'
          ? `https://img.youtube.com/vi/${youtube.id}/hqdefault.jpg`
          : ''
        : data?.cards_cardimage?.image
          ? `https://storage.googleapis.com/study-ways-files/${data.cards_cardimage.image}`
          : ''
      : '';
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);
  return (
    <span className="sw-mobile-tree-cover">
      {image && !failed ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : node.item.type === 'course-link' ? (
        <LinkRounded />
      ) : ids.length > 1 ? (
        <CollectionsBookmarkOutlined />
      ) : data?.card_content_type === 0 ? (
        <PlayCircleOutlineRounded />
      ) : (
        <AccountTreeOutlined />
      )}
    </span>
  );
}
export default function MobileCourseView({
  courseID,
  position,
  onCardSelect,
  explicitPosition,
}: {
  courseID: number;
  position: positionDataI;
  onCardSelect: (id?: string) => void;
  explicitPosition: boolean;
}) {
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [mapLeft, setMapLeft] = useState(0);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const viewport = useRef<HTMLDivElement>(null);
  const arrowID = useId().replace(/:/g, '');
  useEffect(() => {
    let current = true;
    setCourse(null);
    setError(false);
    axiosClient
      .get(`/page/course-by-id/get-course-by-id/${courseID}`)
      .then(res => {
        if (!res.data?.id) throw new Error('Missing course');
        if (current) setCourse(res.data);
      })
      .catch(() => {
        if (current) setError(true);
      });
    return () => {
      current = false;
    };
  }, [courseID, reload]);
  const lines = useMemo(
    () => normalizeCourseData(course?.course_data),
    [course],
  );
  const selected = mobilePosition(lines, position, explicitPosition);
  const allNodes = courseNodes(lines);
  const pageNodes = allNodes.filter(node => node.page === selected.activePage);
  const levelNodes = allNodes.filter(node => node.row === selected.selectedRow);
  const currentNode = pageNodes.find(
    node =>
      node.row === selected.selectedRow &&
      node.index === selected.selectedIndex,
  );
  const currentIndex = levelNodes.findIndex(
    node =>
      node.page === selected.selectedPage &&
      node.index === selected.selectedIndex,
  );
  const currentID =
    currentNode?.item.type === 'course-link' ? undefined : currentNode?.item.id;
  const pageMaterials = useCoursePageMaterials(
    courseID,
    selected.activePage,
    Boolean(
      course &&
      pageNodes.some(
        node =>
          node.item.type !== 'course-link' && cardIDs(node.item.id).length,
      ),
    ),
  );
  const { materials } = pageMaterials;
  useEffect(() => {
    if (course) onCardSelect(currentID == null ? undefined : String(currentID));
  }, [course, currentID, onCardSelect]);
  useEffect(() => {
    if (currentNode)
      setViewed(previous => new Set(previous).add(keyOf(currentNode)));
  }, [
    courseID,
    selected.selectedRow,
    selected.selectedPage,
    selected.selectedIndex,
  ]);
  useEffect(() => {
    if (!course || !allNodes.length) return;
    if (
      !explicitPosition ||
      Object.keys(selected).some(key => selected[key] !== position[key])
    )
      navigate(
        mobileCourseUrl(courseID, {
          page: selected.activePage,
          row: selected.selectedRow,
          index: selected.selectedIndex,
        }),
        { replace: true },
      );
  }, [
    course,
    explicitPosition,
    position.activePage,
    position.selectedPage,
    position.selectedRow,
    position.selectedIndex,
  ]);
  const firstRow = pageNodes.length
    ? Math.min(...pageNodes.map(node => node.row))
    : 0;
  const lastRow = Math.max(...pageNodes.map(node => node.row), 0);
  const lastColumn = Math.max(...pageNodes.map(node => node.index), 0);
  const mapWidth = (lastColumn + 1) * COLUMN;
  const mapHeight = (lastRow - firstRow + 1) * ROW;
  function focusSelected() {
    const element = viewport.current;
    if (!element || !currentNode) return;
    element.scrollLeft = Math.max(
      0,
      (currentNode.index * COLUMN + LEFT + NODE_WIDTH / 2) * zoom -
        element.clientWidth / 2,
    );
    const nodeTop = ((currentNode.row - firstRow) * ROW + TOP) * zoom;
    const nodeBottom = nodeTop + NODE_HEIGHT * zoom;
    if (nodeTop < element.scrollTop)
      element.scrollTop = Math.max(0, nodeTop - TOP * zoom);
    else if (nodeBottom > element.scrollTop + element.clientHeight)
      element.scrollTop = nodeBottom + 16 * zoom - element.clientHeight;
  }
  useEffect(focusSelected, [
    course,
    selected.activePage,
    selected.selectedRow,
    selected.selectedIndex,
    zoom,
  ]);
  function choose(node: MobileCourseNode) {
    if (node.item.type === 'course-link') {
      try {
        const link = new URL(
          node.item.course_link || '',
          window.location.origin,
        );
        if (link.pathname === '/course') navigate(link.pathname + link.search);
      } catch {}
    } else {
      if (zoom < 0.7) setZoom(1);
      navigate(mobileCourseUrl(courseID, node));
    }
  }
  function choosePage(page: number) {
    const nodes = allNodes.filter(node => node.page === page);
    const first =
      nodes.find(
        node =>
          node.row === selected.selectedRow &&
          node.index === selected.selectedIndex,
      ) ||
      nodes.find(node => node.row === selected.selectedRow) ||
      nodes[0];
    navigate(
      mobileCourseUrl(
        courseID,
        first || { row: selected.selectedRow, page, index: -1 },
      ),
    );
  }
  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button onClick={() => setReload(value => value + 1)}>
            Повторить
          </Button>
        }
      >
        Не удалось загрузить курс.
      </Alert>
    );
  if (!course)
    return (
      <div className="sw-mobile-course" aria-label="Загрузка курса">
        <Skeleton height={50} />
        <Skeleton variant="rounded" height={330} />
      </div>
    );
  const mainLevel = Number((course.name || '').match(/\[(.*?)\]/)?.[1]) - 1;
  const pages = lines[0]?.SameLine.length || 1;
  return (
    <section className="sw-mobile-course" aria-label="Навигация по курсу">
      {pageMaterials.isError && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => pageMaterials.refetch()}>Повторить</Button>
          }
        >
          Не удалось загрузить материалы страницы курса.
        </Alert>
      )}
      <header className="sw-mobile-course-heading">
        <button
          className="sw-mobile-course-back"
          onClick={() => navigate('/courses')}
        >
          <ArrowBackRounded />К каталогу курсов
        </button>
        <div className="sw-mobile-course-kicker">
          <AccountTreeOutlined />
          Многоуровневый курс
          <span>{counted(lines.length, ['уровень', 'уровня', 'уровней'])}</span>
        </div>
        <h1>{(course.name || 'Курс').replace(/\[.*?\]/g, '').trim()}</h1>
        <p>
          Вправо — дальше по теме. Между уровнями — другое изложение материала.
        </p>
      </header>
      <div className="sw-mobile-tree-heading">
        <h2>Карта курса</h2>
        {pages > 1 && (
          <div className="sw-mobile-course-pages">
            <Button
              aria-label="Предыдущая страница курса"
              disabled={selected.activePage <= 1}
              onClick={() => choosePage(selected.activePage - 1)}
            >
              <ArrowBackRounded />
            </Button>
            <span>
              {selected.activePage} / {pages}
            </span>
            <Button
              aria-label="Следующая страница курса"
              disabled={selected.activePage >= pages}
              onClick={() => choosePage(selected.activePage + 1)}
            >
              <ArrowForwardRounded />
            </Button>
          </div>
        )}
      </div>
      {pageNodes.length ? (
        <>
          <div className="sw-mobile-tree-toolbar">
            <div>
              <Button
                aria-label="Уменьшить карту"
                disabled={zoom <= 0.4}
                onClick={() => setZoom(value => Math.max(0.4, value - 0.2))}
              >
                <RemoveRounded />
              </Button>
              <span>{Math.round(zoom * 100)}%</span>
              <Button
                aria-label="Увеличить карту"
                disabled={zoom >= 1.4}
                onClick={() => setZoom(value => Math.min(1.4, value + 0.2))}
              >
                <AddRounded />
              </Button>
            </div>
            <Button
              onClick={() => {
                const el = viewport.current;
                if (el) {
                  setZoom(
                    Math.min(
                      1,
                      Math.max(0.2, (el.clientWidth - 12) / mapWidth),
                      370 / mapHeight,
                    ),
                  );
                  el.scrollLeft = 0;
                  el.scrollTop = 0;
                }
              }}
            >
              Обзор
            </Button>
            <Button
              aria-label="Вернуться к выбранному материалу"
              disabled={!currentNode}
              onClick={() => {
                setZoom(1);
                focusSelected();
              }}
            >
              <CenterFocusStrongRounded />
            </Button>
          </div>
          <div
            className="sw-mobile-tree-viewport"
            ref={viewport}
            onScroll={event => setMapLeft(event.currentTarget.scrollLeft)}
            role="region"
            aria-label="Дерево материалов курса. Прокрутите карту в любом направлении."
            tabIndex={0}
            style={{ height: Math.min(390, mapHeight * zoom + 12) }}
          >
            <div
              className="sw-mobile-tree-extent"
              style={{ width: mapWidth * zoom, height: mapHeight * zoom }}
            >
              <div
                className="sw-mobile-tree-canvas"
                style={{
                  width: mapWidth,
                  height: mapHeight,
                  transform: `scale(${zoom})`,
                }}
              >
                {lines.map(
                  (_, row) =>
                    row >= firstRow &&
                    row <= lastRow && (
                      <div
                        key={row}
                        className={`sw-mobile-tree-lane${row === mainLevel ? ' is-main' : ''}`}
                        style={{
                          top: (row - firstRow) * ROW,
                          height: ROW,
                          width: mapWidth,
                        }}
                      >
                        <span style={{ left: mapLeft / zoom + 12 }}>
                          Уровень {row + 1}
                          {row === mainLevel && <small>Основной маршрут</small>}
                        </span>
                      </div>
                    ),
                )}
                <svg
                  className="sw-mobile-tree-paths"
                  width={mapWidth}
                  height={mapHeight}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id={arrowID}
                      viewBox="0 0 6 6"
                      refX="5"
                      refY="3"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M 0 0 L 6 3 L 0 6"
                        fill="none"
                        stroke="currentColor"
                      />
                    </marker>
                  </defs>
                  {lines.flatMap((_, row) => {
                    const nodes = pageNodes.filter(node => node.row === row);
                    const y = (row - firstRow) * ROW + TOP + NODE_HEIGHT / 2;
                    return nodes
                      .slice(1)
                      .map((node, i) => (
                        <path
                          key={`h${row}:${node.index}`}
                          className="sw-mobile-tree-forward"
                          markerEnd={`url(#${arrowID})`}
                          d={`M ${nodes[i].index * COLUMN + LEFT + NODE_WIDTH + 2} ${y} H ${node.index * COLUMN + LEFT - 4}`}
                        />
                      ));
                  })}
                  {pageNodes
                    .filter(node =>
                      pageNodes.some(
                        other =>
                          other.row === node.row + 1 &&
                          other.index === node.index,
                      ),
                    )
                    .map(node => (
                      <path
                        key={`v${node.row}:${node.index}`}
                        className="sw-mobile-tree-alternative"
                        d={`M ${node.index * COLUMN + LEFT + NODE_WIDTH / 2} ${(node.row - firstRow) * ROW + TOP + NODE_HEIGHT + 3} V ${(node.row + 1 - firstRow) * ROW + TOP - 3}`}
                      />
                    ))}
                </svg>
                {pageNodes.map(node => {
                  const active =
                    node.row === selected.selectedRow &&
                    node.index === selected.selectedIndex;
                  const title = materialTitle(node, materials);
                  return (
                    <button
                      key={keyOf(node)}
                      className={`sw-mobile-tree-node${active ? ' is-current' : ''}${viewed.has(keyOf(node)) ? ' is-viewed' : ''}${node.item.type === 'course-link' ? ' is-link' : ''}`}
                      style={{
                        left: node.index * COLUMN + LEFT,
                        top: (node.row - firstRow) * ROW + TOP,
                        width: NODE_WIDTH,
                        height: NODE_HEIGHT,
                      }}
                      aria-label={`Уровень ${node.row + 1}: ${title}`}
                      aria-current={active ? 'step' : undefined}
                      onClick={() => choose(node)}
                    >
                      <MaterialCover
                        node={node}
                        data={materials[cardIDs(node.item.id)[0]]}
                      />
                      <strong>{title}</strong>
                      <small>
                        {active
                          ? 'Сейчас изучаете'
                          : node.item.type === 'course-link'
                            ? 'Открыть курс →'
                            : viewed.has(keyOf(node))
                              ? 'Просмотрено'
                              : 'Открыть материал'}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="sw-mobile-tree-legend">
            <span>
              <i />
              По теме
            </span>
            <span>
              <i />
              Другой уровень
            </span>
            <small>Листайте карту пальцем</small>
          </div>
        </>
      ) : (
        <p className="sw-mobile-course-empty">
          На этой странице пока нет материалов.
        </p>
      )}
      {currentNode && (
        <div className="sw-mobile-course-current">
          <small>
            Уровень {selected.selectedRow + 1} · материал {currentIndex + 1} из{' '}
            {levelNodes.length}
          </small>
          <strong>{materialTitle(currentNode, materials)}</strong>
        </div>
      )}
      {currentNode && (
        <div className="sw-mobile-course-navigation">
          <Button
            variant="outlined"
            startIcon={<ArrowBackRounded />}
            disabled={currentIndex <= 0}
            onClick={() => choose(levelNodes[currentIndex - 1])}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            disableElevation
            endIcon={<ArrowForwardRounded />}
            disabled={currentIndex < 0 || currentIndex >= levelNodes.length - 1}
            onClick={() => choose(levelNodes[currentIndex + 1])}
          >
            Далее
          </Button>
        </div>
      )}
    </section>
  );
}
