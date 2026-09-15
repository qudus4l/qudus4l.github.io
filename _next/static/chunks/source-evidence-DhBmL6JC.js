import{r as e}from"./framework-D_rUT4EX.js";import{gt as t}from"./useOpenChangeComplete-DsV6aOdL.js";import{i as n,n as r,r as i}from"./accordion-DVZTXw5i.js";var a=t(`book-open`,[[`path`,{d:`M12 5v16`,key:`1f6ucr`}],[`path`,{d:`M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z`,key:`1fyvmf`}]]),o=t(`rotate-ccw`,[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}]]),s=e();function c({evidence:e}){return(0,s.jsxs)(i,{value:`source-${e.id}`,className:`source-evidence`,children:[(0,s.jsx)(n,{children:(0,s.jsxs)(`span`,{className:`source-evidence-title`,children:[(0,s.jsx)(`span`,{className:`source-evidence-label`,children:`FROM THE SOURCE`}),(0,s.jsx)(`span`,{children:e.title})]})}),(0,s.jsx)(r,{children:(0,s.jsxs)(`div`,{className:`source-evidence-body`,children:[(0,s.jsx)(`p`,{children:e.explanation}),(0,s.jsxs)(`figure`,{children:[(0,s.jsxs)(`figcaption`,{children:[(0,s.jsxs)(`span`,{children:[e.kind,` · `,e.language]}),(0,s.jsx)(`span`,{children:e.file})]}),(0,s.jsx)(`pre`,{children:(0,s.jsx)(`code`,{children:e.code})})]}),(0,s.jsx)(`p`,{className:`source-evidence-limit`,children:e.limit})]})})]})}var l={oyster:{id:`oyster-search`,title:`Inspect the database ranking query`,kind:`Implementation excerpt`,language:`PHP`,file:`app/Services/VectorSearch/PgVectorSearchService.php`,explanation:`This is where the work moved. PostgreSQL calculates cosine distance, orders the candidates, and limits the result set. PHP receives the ranked results instead of scoring every candidate itself.`,limit:`This excerpt shows where ranking happens. The reported speed improvement is qualitative; it does not supply a latency benchmark.`,code:`$query->select([
    "{$table}.id",
    DB::raw("({$table}.{$vectorColumn} <=> ?) AS distance"),
])
    ->whereNotNull("{$table}.{$vectorColumn}")
    ->addBinding((string) $vectorLiteral, 'select')
    ->orderBy('distance')
    ->limit($limit);`},classification:{id:`classifier-split`,title:`Inspect the checks against data leakage`,kind:`Training-script excerpt`,language:`Python`,file:`scripts/train_proper.py`,explanation:`The training script stops if a normalized product group appears in two partitions. Here, itr, iva, and ite are the training, validation, and test indexes. Variants caught by the grouping rule stay on one side of each boundary.`,limit:`These assertions check group separation, not label correctness. The labels are model-generated, and normalization cannot catch every duplicate.`,code:`assert not (set(groups[itr]) & set(groups[ite])), "group leak train/test"
assert not (set(groups[itr]) & set(groups[iva])), "group leak train/val"
assert not (set(groups[iva]) & set(groups[ite])), "group leak val/test"`},calassist:{id:`calassist-seats`,title:`Inspect the seat-reduction test`,kind:`Unit-test excerpt`,language:`TypeScript`,file:`src/billing/billing.service.spec.ts`,explanation:`Four members and two pending invitations already commit six seats. This test asks to reduce the subscription to five and expects rejection before any Stripe quantity update.`,limit:`The workspace and Stripe services are mocked. This is an excerpt of the test’s expected behavior, not a recorded test run or a guarantee about concurrent seat changes.`,code:`workspacesServiceMock.countWorkspaceUsage.mockResolvedValue({
  memberCount: 4,
  pendingInviteCount: 2,
  total: 6,
});

await expect(service.updateSeats('user-1', 5)).rejects.toThrow(
  /below current usage/i,
);
expect(
  stripeServiceMock.updateSubscriptionQuantity,
).not.toHaveBeenCalled();`},fingerphoto:{id:`fingerphoto-gate`,title:`Inspect the capture-quality gate`,kind:`Implementation excerpt`,language:`Python`,file:`fingerphoto/identity.py`,explanation:`The crop first has to pass geometry checks. When quality checking is enabled, missing or low ridge evidence also causes rejection. The function records a reason and returns without extracting a matching template.`,limit:`The quality score uses unenhanced, scale-normalized pixels from the pipeline. It is a heuristic capture check; passing it does not establish identity or biometric accuracy.`,code:`reason = crop_sanity_reason(info, strategy, bgr.shape[:2], frame_shape)
if reason is None and min_quality > 0 and (
    not q.get("valid") or q.get("score", 0.0) < min_quality
):
    reason = "ridge_quality"
if reason is not None:
    report["rejected"] = reason
    return []`}};export{a as i,c as n,o as r,l as t};